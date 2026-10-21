export const DOCUMENT_DETAIL_FIELDS = [
  { key: "deliveryNote", label: "Delivery Note", labelHi: "Delivery Note" },
  { key: "paymentTerms", label: "Mode/Terms of Payment", labelHi: "भुगतान का तरीका/शर्तें" },
  { key: "referenceNoDate", label: "Reference No. & Date", labelHi: "Reference No. & Date" },
  { key: "otherReferences", label: "Other References", labelHi: "अन्य References" },
  { key: "buyersOrderNo", label: "Buyer's Order No.", labelHi: "Buyer का Order No." },
  { key: "dated", label: "Dated", labelHi: "तारीख" },
  { key: "dispatchDocNo", label: "Dispatch Doc No.", labelHi: "Dispatch Doc No." },
  { key: "deliveryNoteDate", label: "Delivery Note Date", labelHi: "Delivery Note Date" },
  { key: "dispatchedThrough", label: "Dispatched through", labelHi: "किस माध्यम से भेजा" },
  { key: "destination", label: "Destination", labelHi: "गंतव्य" },
  { key: "termsOfDelivery", label: "Terms of Delivery", labelHi: "डिलीवरी की शर्तें" },
];

export function cleanDocumentDetails(value) {
  const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  return Object.fromEntries(DOCUMENT_DETAIL_FIELDS.map(({ key }) => {
    const raw = source[key];
    const text = typeof raw === "string" || typeof raw === "number" ? String(raw) : "";
    return [key, text.trim().slice(0, 240)];
  }));
}
