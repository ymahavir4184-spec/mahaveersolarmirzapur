"use client";

import BillProductRow from "./BillProductRow";

const newItem = (requireGstRate) => ({ id: `line_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, productName: "", hsnSac: "", quantity: "1", unitPrice: "", gstRate: requireGstRate ? "" : "0" });

export default function BillLineEditor({ items, setItems, gstEnabled, requireGstRate = false, showHsn = gstEnabled, showUnit = false, lang = "hi" }) {
  const updateItem = (id, field, value) => setItems((current) => current.map((item) => item.id === id ? { ...item, [field]: value } : item));
  const addItem = () => {
    if (items.length >= 100) return;
    const item = { ...newItem(requireGstRate), ...(showUnit ? { unit: "pcs" } : {}) };
    setItems((current) => [...current, item]);
    window.requestAnimationFrame(() => document.querySelector(`[data-product-id="${item.id}"]`)?.focus());
  };
  const removeItem = (id) => setItems((current) => current.length === 1 ? [{ ...current[0], productName: "", hsnSac: "", quantity: "1", unitPrice: "", gstRate: requireGstRate ? "" : "0" }] : current.filter((item) => item.id !== id));

  return (
    <section className="space-y-3" aria-labelledby="bill-products-heading">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="bill-products-heading" className="text-base font-bold text-slate-900">{lang === "hi" ? "प्रोडक्ट / सेवाएँ" : "Products / services"}</h2>
          <p className="text-xs text-slate-500">{lang === "hi" ? "प्रोडक्ट या कीमत पर Enter दबाएँ; अगली लाइन जुड़ जाएगी। Tab से अगले फ़ील्ड पर जाएँ।" : "Press Enter in a product or price field to add a row. Tab moves to the next field."}</p>
        </div>
        <button type="button" onClick={addItem} disabled={items.length >= 100} className="min-h-10 rounded-lg border border-blue-200 bg-blue-50 px-3.5 text-sm font-bold text-blue-700 hover:bg-blue-100 disabled:opacity-50">+ {lang === "hi" ? "प्रोडक्ट जोड़ें" : "Add product"}</button>
      </div>
      <div className="space-y-2.5">
        {items.map((item, index) => (
          <BillProductRow key={item.id} item={item} index={index} gstEnabled={gstEnabled} requireGstRate={requireGstRate} showHsn={showHsn} showUnit={showUnit} lang={lang} onChange={(field, value) => updateItem(item.id, field, value)} onAdd={addItem} onRemove={() => removeItem(item.id)} />
        ))}
      </div>
    </section>
  );
}
