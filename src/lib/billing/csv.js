import { DOCUMENT_DETAIL_FIELDS } from "@/lib/billing/documentDetails";

const SELLER_FIELDS = [
  ["Business legal name", "name"],
  ["Brand name", "brandName"],
  ["Business address", "address"],
  ["Phone", "phone"],
  ["Mobile", "mobile"],
  ["Email", "email"],
  ["GSTIN/UIN", "gstin"],
  ["PAN", "pan"],
  ["State name", "stateName"],
  ["State code", "stateCode"],
  ["Bank name", "bankName"],
  ["Bank account", "bankAccount"],
  ["Bank branch / IFSC", "bankBranchIfsc"],
];

export function csvCell(value) {
  let text = String(value ?? "");
  const isNumber = typeof value === "number" && Number.isFinite(value);
  const numericText = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text);
  if (!isNumber && !numericText && /^[\u0000-\u0020\uFEFF]*[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export function csvRow(values) {
  return values.map(csvCell).join(",");
}

export function sellerCsvRows(snapshot) {
  return SELLER_FIELDS.map(([label, key]) => csvRow([label, snapshot?.[key] ?? ""]));
}

export function documentDetailHeaders() {
  return DOCUMENT_DETAIL_FIELDS.map(({ label }) => label);
}

export function documentDetailValues(details) {
  return DOCUMENT_DETAIL_FIELDS.map(({ key }) => details?.[key] ?? "");
}

export function taxModeLabel(mode) {
  if (mode === "intra") return "CGST + SGST";
  if (mode === "inter") return "IGST";
  return "No GST";
}

export function makeCsvResponse(rows, filename) {
  return new Response(`\uFEFF${rows.join("\r\n")}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function downloadCsvFile(url) {
  const response = await fetch(url, { cache: "no-store", credentials: "same-origin" });
  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new Error(result.message || "The report could not be downloaded.");
  }
  const filename = response.headers.get("Content-Disposition")?.match(/filename="([^"]+)"/i)?.[1] || "report.csv";
  const objectUrl = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}
