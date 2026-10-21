"use client";

import { DOCUMENT_DETAIL_FIELDS } from "@/lib/billing/documentDetails";

export default function InvoiceDocumentDetailsFields({ details, setDetails, lang = "hi" }) {
  const hi = lang === "hi";
  const update = (key, value) => setDetails((current) => ({ ...current, [key]: value.slice(0, 240) }));
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4">
        <h2 className="text-base font-bold text-slate-900">{hi ? "रसीद की वैकल्पिक जानकारी" : "Optional receipt details"}</h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">{hi ? "ज़रूरत हो तभी भरें। खाली छोड़ने पर PDF में संबंधित जगह blank रहेगी।" : "Fill only when needed. Fields left empty will print blank on the PDF."}</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {DOCUMENT_DETAIL_FIELDS.map(({ key, label, labelHi }) => (
          <label key={key} className="text-xs font-semibold text-slate-700">
            {hi ? labelHi : label}
            <input value={details?.[key] || ""} onChange={(event) => update(key, event.target.value)} maxLength={240} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-normal focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" />
          </label>
        ))}
      </div>
    </section>
  );
}
