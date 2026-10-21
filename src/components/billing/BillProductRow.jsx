"use client";

export default function BillProductRow({ item, index, gstEnabled, requireGstRate = false, showHsn = gstEnabled, showUnit = false, lang = "hi", onChange, onAdd, onRemove }) {
  const hi = lang === "hi";
  const onEnter = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onAdd();
    }
  };

  const inputClass = "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100";
  return (
    <div className={`grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 sm:items-end ${showUnit ? "sm:grid-cols-[minmax(0,1fr)_7rem_5.5rem_5rem_6rem_auto]" : "sm:grid-cols-[minmax(0,1fr)_8rem_6rem_7rem_auto]"}`}>
      <label className="min-w-0 text-xs font-semibold text-slate-600">
        <span className="mb-1 block">{hi ? `प्रोडक्ट ${index + 1} *` : `Product ${index + 1} *`}</span>
        <input
          data-product-id={item.id}
          value={item.productName}
          onChange={(event) => onChange("productName", event.target.value)}
          onKeyDown={onEnter}
          maxLength={240}
          required
          placeholder={hi ? "प्रोडक्ट या सेवा का नाम" : "Product or service name"}
          className={inputClass}
        />
        {showHsn && (
          <input
            value={item.hsnSac}
            onChange={(event) => onChange("hsnSac", event.target.value)}
            maxLength={24}
            placeholder={hi ? "HSN/SAC (वैकल्पिक)" : "HSN/SAC (optional)"}
            className={`${inputClass} mt-2`}
          />
        )}
      </label>
      <label className="text-xs font-semibold text-slate-600">
        <span className="mb-1 block">{hi ? "कीमत (₹) *" : "Price (INR) *"}</span>
        <input type="number" inputMode="decimal" min="0" step="0.01" value={item.unitPrice} onKeyDown={onEnter} onChange={(event) => onChange("unitPrice", event.target.value)} required className={inputClass} />
      </label>
      <label className="text-xs font-semibold text-slate-600">
        <span className="mb-1 block">{hi ? "मात्रा *" : "Qty *"}</span>
        <input type="number" inputMode="decimal" min="0.001" max="100000" step="0.001" value={item.quantity} onKeyDown={onEnter} onChange={(event) => onChange("quantity", event.target.value)} required className={inputClass} />
      </label>
      {showUnit && <label className="text-xs font-semibold text-slate-600"><span className="mb-1 block">{hi ? "इकाई" : "Unit"}</span><input value={item.unit || ""} onChange={(event) => onChange("unit", event.target.value)} maxLength={24} placeholder="pcs" className={inputClass} /></label>}
      <label className="text-xs font-semibold text-slate-600">
        <span className="mb-1 block">GST %</span>
        <select disabled={!gstEnabled} required={gstEnabled && requireGstRate} value={item.gstRate} onChange={(event) => onChange("gstRate", event.target.value)} className={`${inputClass} disabled:bg-slate-100 disabled:text-slate-500`}>
          {requireGstRate && <option value="">{hi ? "GST दर चुनें *" : "Select GST rate *"}</option>}
          {(requireGstRate ? [5, 12, 18, 28] : [0, 5, 12, 18, 28]).map((rate) => <option key={rate} value={rate}>{rate}%</option>)}
        </select>
      </label>
      <button type="button" onClick={onRemove} aria-label={hi ? `प्रोडक्ट ${index + 1} हटाएँ` : `Remove product ${index + 1}`} className="min-h-11 rounded-lg border border-slate-300 px-3 text-sm font-semibold text-slate-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700 sm:min-h-0 sm:py-2.5">
        {hi ? "हटाएँ" : "Remove"}
      </button>
    </div>
  );
}
