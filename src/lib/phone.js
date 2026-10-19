/**
 * Indian Mobile Number Validator and Normalizer
 * Accepts 10 digits starting with 6, 7, 8, or 9
 * Strips whitespace, hyphens, parentheses, optional leading '0' or '+91'
 * Normalizes to standard format: +91XXXXXXXXXX
 */

export function normalizeIndianPhone(input) {
  if (!input || typeof input !== "string") {
    return { isValid: false, normalized: "" };
  }

  // Strip non-digits except a leading +
  let cleaned = input.trim().replace(/[\s\-()]/g, "");

  // If starts with +91, remove +91
  if (cleaned.startsWith("+91")) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith("91") && cleaned.length === 12) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith("0") && cleaned.length === 11) {
    cleaned = cleaned.slice(1);
  }

  // Must be exactly 10 digits starting with 6, 7, 8, or 9
  const indianMobileRegex = /^[6-9]\d{9}$/;
  const isValid = indianMobileRegex.test(cleaned);

  return {
    isValid,
    normalized: isValid ? `+91${cleaned}` : cleaned,
  };
}
