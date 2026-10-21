"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import BillLineEditor from "./BillLineEditor";
import BillInvoicePreview from "./BillInvoicePreview";
import BusinessProfileCard from "./BusinessProfileCard";
import IndianStateFields from "./IndianStateFields";
import InvoiceDocumentDetailsFields from "./InvoiceDocumentDetailsFields";
import TaxTreatmentHint from "./TaxTreatmentHint";
import { calculateBill, formatINR } from "@/lib/billing/billMath";
import { cleanDocumentDetails } from "@/lib/billing/documentDetails";

const firstItem = () => ({ id: `line_${Date.now()}`, productName: "", hsnSac: "", quantity: "1", unit: "pcs", unitPrice: "", gstRate: "0" });

export default function BillBuilder({ lang = "hi", onBack }) {
  const hi = lang === "hi";
  const [business, setBusiness] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerStateName, setCustomerStateName] = useState("Uttar Pradesh");
  const [customerStateCode, setCustomerStateCode] = useState("09");
  const [documentDetails, setDocumentDetails] = useState(() => cleanDocumentDetails());
  const [items, setItems] = useState([firstItem()]);
  const [taxMode, setTaxMode] = useState("none");
  const [savedBill, setSavedBill] = useState(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const requestId = useRef(null);
  const totals = useMemo(() => calculateBill(items, taxMode), [items, taxMode]);

  useEffect(() => {
    let active = true;
    fetch("/api/bills", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Billing database is unavailable.");
        if (active) setBusiness(data.settings.business);
      })
      .catch((reason) => { if (active) setError(reason.message); })
      .finally(() => { if (active) setLoadingSettings(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (savedBill) window.scrollTo(0, 0);
  }, [savedBill]);

  const changeTaxMode = (mode) => {
    setTaxMode(mode);
    if (mode === "none") setItems((current) => current.map((item) => ({ ...item, gstRate: "0" })));
    else setItems((current) => current.map((item) => ({ ...item, gstRate: Number(item.gstRate) > 0 ? item.gstRate : "" })));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (taxMode === "none" && items.some((item) => Number(item.gstRate) > 0)) {
      setError(hi ? "GST प्रतिशत चुना है। बिल सेव करने से पहले GST का प्रकार चुनें।" : "A GST rate is selected. Choose a tax treatment before saving the bill.");
      return;
    }
    if (taxMode !== "none" && items.some((item) => ![5, 12, 18, 28].includes(Number(item.gstRate)))) {
      setError(hi ? "GST प्रकार चुना है। हर प्रोडक्ट के लिए GST दर चुनें।" : "A GST mode is selected. Choose a GST rate for every product.");
      return;
    }
    setSaving(true);
    requestId.current ||= crypto.randomUUID();
    const invoiceAddress = [
      customerAddress.trim(),
      customerStateName.trim() ? `State Name : ${customerStateName.trim()}, Code : ${customerStateCode.trim()}` : "",
    ].filter(Boolean).join("\n").slice(0, 500);
    try {
      const response = await fetch("/api/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: requestId.current, customerName, customerMobile, customerAddress: invoiceAddress, taxMode, items, documentDetails }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Bill could not be saved.");
      setSavedBill({ ...result.data.bill, items: result.data.items || [] });
      requestId.current = null;
    } catch (reason) {
      setError(reason.message || "Bill could not be saved.");
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    const { downloadBillPdf } = await import("@/lib/billing/billPdfGenerator");
    downloadBillPdf(savedBill, savedBill.seller_snapshot || business);
  };
  const handlePrint = async () => {
    const { printBillPdf } = await import("@/lib/billing/billPdfGenerator");
    printBillPdf(savedBill, savedBill.seller_snapshot || business);
  };

  if (savedBill) {
    return <BillInvoicePreview bill={savedBill} business={savedBill.seller_snapshot || business} onDownload={handleDownload} onPrint={handlePrint} onDone={onBack} />;
  }

  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-blue-700">{hi ? "बिलिंग" : "Billing"}</p>
          <h1 className="text-2xl font-black text-slate-900">{hi ? "नया बिल बनाएँ" : "Generate Bill"}</h1>
          <p className="mt-1 text-sm text-slate-600">{hi ? "नाम और मोबाइल नंबर ज़रूरी हैं; पता वैकल्पिक है।" : "Customer name and mobile are required; address is optional."}</p>
        </div>
        <button type="button" onClick={onBack} className="min-h-10 rounded-lg border border-slate-300 bg-white px-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">← {hi ? "डैशबोर्ड" : "Dashboard"}</button>
      </header>

      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
      {loadingSettings ? <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">{hi ? "बिलिंग सेटिंग लोड हो रही हैं…" : "Loading billing settings…"}</div> : business && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <BusinessProfileCard business={business} lang={lang} />
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 text-base font-bold text-slate-900">{hi ? "ग्राहक का विवरण" : "Customer details"}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="text-xs font-semibold text-slate-700">{hi ? "नाम *" : "Name *"}<input value={customerName} onChange={(event) => setCustomerName(event.target.value)} required minLength={2} maxLength={160} autoComplete="name" className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" /></label>
              <label className="text-xs font-semibold text-slate-700">{hi ? "मोबाइल नंबर *" : "Mobile number *"}<span className="mt-1.5 flex rounded-lg border border-slate-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100"><span className="border-r border-slate-200 px-3 py-2.5 text-sm text-slate-500">+91</span><input type="tel" inputMode="numeric" value={customerMobile} onChange={(event) => setCustomerMobile(event.target.value.replace(/\D/g, "").slice(0, 10))} required minLength={10} maxLength={10} autoComplete="tel-national" className="w-full min-w-0 rounded-r-lg px-3 py-2.5 text-sm outline-none" /></span></label>
              <label className="text-xs font-semibold text-slate-700 sm:col-span-2">{hi ? "पता (वैकल्पिक)" : "Address (optional)"}<textarea value={customerAddress} onChange={(event) => setCustomerAddress(event.target.value)} maxLength={420} rows={2} autoComplete="street-address" className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100" /></label>
              <IndianStateFields stateName={customerStateName} stateCode={customerStateCode} onStateNameChange={setCustomerStateName} onStateCodeChange={setCustomerStateCode} lang={lang} />
            </div>
          </section>

          <InvoiceDocumentDetailsFields details={documentDetails} setDetails={setDocumentDetails} lang={lang} />

          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            {business.gstEnabled ? (
              <div className="grid gap-3 sm:grid-cols-[minmax(0,20rem)_1fr] sm:items-end">
                <label className="block text-xs font-semibold text-slate-700">{hi ? "GST का प्रकार" : "Tax treatment"}<select value={taxMode} onChange={(event) => changeTaxMode(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"><option value="none">{hi ? "GST न लगाएँ" : "No GST"}</option><option value="intra">Intra-state — CGST + SGST</option><option value="inter">Inter-state — IGST</option></select></label>
                <TaxTreatmentHint lang={lang} />
              </div>
            ) : <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">{hi ? "कंपनी GSTIN सेट नहीं है। अभी सामान्य बिल बनेगा और GST दरें बंद रहेंगी।" : "Company GSTIN is not configured. Bills will be generated without GST until a valid GSTIN is set."}</p>}
            {business.gstEnabled && taxMode === "none" && items.some((item) => Number(item.gstRate) > 0) && <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">{hi ? "GST प्रतिशत चुना है, लेकिन अभी No GST चुना हुआ है। GST जोड़ने के लिए Intra-state या Inter-state चुनें।" : "A GST rate is selected while No GST is active. Choose Intra-state or Inter-state to calculate GST."}</p>}
            {taxMode !== "none" && items.some((item) => ![5, 12, 18, 28].includes(Number(item.gstRate))) && <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">{hi ? "GST लगाया जा रहा है। हर प्रोडक्ट की सही GST दर dropdown से चुनें।" : "GST is active. Select the correct GST rate from the dropdown for every product."}</p>}
            <BillLineEditor items={items} setItems={setItems} gstEnabled={Boolean(business.gstEnabled)} requireGstRate={taxMode !== "none"} showUnit lang={lang} />
          </section>

          <div className="ml-auto max-w-sm rounded-2xl border border-slate-300 bg-white p-4 text-sm shadow-sm">
            <p className="flex justify-between text-slate-600"><span>{hi ? "कुल राशि" : "Subtotal"}</span><span>{formatINR(totals.subtotal)}</span></p>
            {totals.taxTotal > 0 && <p className="mt-1 flex justify-between text-slate-600"><span>GST</span><span>{formatINR(totals.taxTotal)}</span></p>}
            <p className="mt-2 flex justify-between border-t border-slate-200 pt-2 text-base font-black text-slate-900"><span>{hi ? "कुल देय" : "Grand total"}</span><span>{formatINR(totals.grandTotal)}</span></p>
          </div>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <button type="button" onClick={onBack} className="min-h-12 rounded-xl border border-slate-300 bg-white px-5 text-sm font-bold text-slate-700">{hi ? "रद्द करें" : "Cancel"}</button>
            <button type="submit" disabled={saving || loadingSettings || !business} className="min-h-12 rounded-xl bg-blue-600 px-6 text-sm font-bold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">{saving ? (hi ? "सेव हो रहा है…" : "Saving…") : (hi ? "बिल बनाएँ और सेव करें" : "Generate Bill & Save")}</button>
          </div>
        </form>
      )}
    </section>
  );
}
