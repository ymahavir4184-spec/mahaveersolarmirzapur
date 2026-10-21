"use client";

import { useEffect, useState } from "react";

export default function BillInvoicePreview({ bill, business, onDownload, onPrint, onDone }) {
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewError, setPreviewError] = useState("");

  useEffect(() => {
    let active = true;
    let objectUrl = "";
    import("@/lib/billing/billPdfGenerator")
      .then(({ createBillPdf }) => {
        const blob = createBillPdf(bill, business).output("blob");
        objectUrl = URL.createObjectURL(blob);
        if (active) setPreviewUrl(objectUrl);
        else URL.revokeObjectURL(objectUrl);
      })
      .catch(() => { if (active) setPreviewError("Invoice preview could not be loaded. Download the PDF to view it."); });
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [bill, business]);

  return (
    <section className="mx-auto max-w-5xl space-y-4" aria-labelledby="bill-preview-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Saved to Supabase</p>
          <h2 id="bill-preview-heading" className="text-xl font-black text-slate-900">{bill.bill_number}</h2>
          <p className="mt-1 text-sm text-slate-600">A4 invoice preview · {business.name}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={onDownload} className="min-h-10 rounded-lg bg-slate-900 px-3.5 text-sm font-bold text-white hover:bg-slate-700">Download A4 PDF</button>
          <button type="button" onClick={onPrint} className="min-h-10 rounded-lg border border-slate-300 px-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50">Print</button>
          <button type="button" onClick={onDone} className="min-h-10 rounded-lg border border-slate-300 px-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50">Back to dashboard</button>
        </div>
      </div>
      {previewError && <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{previewError}</p>}
      {previewUrl ? (
        <iframe title={`A4 invoice ${bill.bill_number}`} src={previewUrl} className="h-[min(80vh,1050px)] w-full rounded-xl border border-slate-300 bg-slate-100 shadow-sm" />
      ) : !previewError ? (
        <div className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">Preparing the A4 invoice preview…</div>
      ) : null}
    </section>
  );
}
