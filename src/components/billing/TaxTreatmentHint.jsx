"use client";

export default function TaxTreatmentHint({ lang = "hi" }) {
  const hi = lang === "hi";

  return (
    <aside className="rounded-lg border border-blue-100 bg-blue-50/70 px-3 py-2.5 text-xs leading-5 text-slate-700" aria-label={hi ? "GST विकल्पों की मदद" : "Tax treatment guide"}>
      <p className="font-bold text-slate-800">{hi ? "जल्दी समझें" : "Quick guide"}</p>
      <ul className="mt-1 space-y-0.5">
        <li><b>{hi ? "GST न लगाएँ:" : "No GST:"}</b> {hi ? "बिल में GST न जोड़ें।" : "Do not add GST to this bill."}</li>
        <li><b>Intra-state:</b> {hi ? "दोनों एक राज्य में — CGST + SGST।" : "Both in the same state — CGST + SGST."}</li>
        <li><b>Inter-state:</b> {hi ? "अलग-अलग राज्य — IGST।" : "Different states — IGST."}</li>
      </ul>
      <p className="mt-1 font-semibold text-blue-800">{hi ? "ग्राहक के राज्य के अनुसार चुनें।" : "Choose based on the customer's state."}</p>
    </aside>
  );
}
