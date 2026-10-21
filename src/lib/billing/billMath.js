export const GST_RATES = Object.freeze([0, 5, 12, 18, 28]);

const QUANTITY_SCALE = 3;
const PRICE_SCALE = 2;
const MAX_TOTAL_PAISE = 99_999_999_999_999n;

/** Convert a non-negative decimal to an integer at the requested scale. */
export function decimalToScaledInteger(value, scale) {
  if (!Number.isInteger(scale) || scale < 0 || scale > 6) return null;
  const raw = String(value ?? "").trim();
  if (!raw || raw.length > 64 || !/^\d+(?:\.\d+)?$/.test(raw)) return null;

  const [whole, fraction = ""] = raw.split(".");
  const extraDigits = fraction.slice(scale);
  if (extraDigits && /[1-9]/.test(extraDigits)) return null;

  const scaledFraction = fraction.slice(0, scale).padEnd(scale, "0");
  try {
    return BigInt(whole) * 10n ** BigInt(scale) + BigInt(scaledFraction || "0");
  } catch {
    return null;
  }
}

/** Positive integer division rounded half up, matching PostgreSQL numeric round(). */
export function roundHalfUp(numerator, denominator) {
  if (typeof numerator !== "bigint" || typeof denominator !== "bigint" || numerator < 0n || denominator <= 0n) return null;
  return (numerator + denominator / 2n) / denominator;
}

export function sumMoney(values) {
  let totalPaise = 0n;
  for (const value of values) {
    const paise = decimalToScaledInteger(value ?? 0, 2);
    if (paise === null) continue;
    totalPaise += paise;
  }
  return Number(totalPaise) / 100;
}

export function sumMoneyDecimal(values) {
  let totalPaise = 0n;
  for (const value of values) {
    const paise = decimalToScaledInteger(value ?? 0, 2);
    if (paise === null) continue;
    totalPaise += paise;
  }
  return `${totalPaise / 100n}.${String(totalPaise % 100n).padStart(2, "0")}`;
}

function paiseToRupees(paise) {
  return Number(paise) / 100;
}

export function calculateBill(items = [], taxMode = "none") {
  let subtotalPaise = 0n;
  let taxTotalPaise = 0n;

  for (const item of items) {
    const quantityMilli = decimalToScaledInteger(item.quantity ?? 1, QUANTITY_SCALE);
    const unitPricePaise = decimalToScaledInteger(item.unitPrice ?? 0, PRICE_SCALE);
    const gstRate = Number(item.gstRate ?? 0);
    if (quantityMilli === null || unitPricePaise === null || quantityMilli <= 0n || !GST_RATES.includes(gstRate)) continue;

    const taxablePaise = roundHalfUp(quantityMilli * unitPricePaise, 1000n);
    const taxPaise = taxMode !== "none" && gstRate > 0
      ? roundHalfUp(taxablePaise * BigInt(gstRate), 100n)
      : 0n;
    subtotalPaise += taxablePaise;
    taxTotalPaise += taxPaise;
  }

  const grandTotalPaise = subtotalPaise + taxTotalPaise;
  return {
    subtotal: paiseToRupees(subtotalPaise),
    taxTotal: paiseToRupees(taxTotalPaise),
    grandTotal: paiseToRupees(grandTotalPaise),
    exceedsSupportedAmount: grandTotalPaise > MAX_TOTAL_PAISE,
  };
}

export function formatINR(value) {
  const amount = Number(value);
  return `₹${(Number.isFinite(amount) ? amount : 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
