"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { formatINR } from "@/lib/billing/billMath";
import { downloadCsvFile } from "@/lib/billing/csv";

const PAGE_SIZE = 50;

export default function BillRecords({ lang = "hi", onBack }) {
  const hi = lang === "hi";
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(0);
  const [bills, setBills] = useState([]);
  const [summary, setSummary] = useState(null);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);
  const lastQueryRef = useRef("");
  const hasLoadedRef = useRef(false);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(page * PAGE_SIZE) });
    if (search.trim()) params.set("search", search.trim());
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const queryKey = params.toString();
    const isBackgroundRefresh = hasLoadedRef.current && lastQueryRef.current === queryKey;
    lastQueryRef.current = queryKey;
    const timer = window.setTimeout(async () => {
      isFetchingRef.current = true;
      if (!isBackgroundRefresh) {
        setLoading(true);
        setError("");
      }
      try {
        const response = await fetch(`/api/bills?${params}`, { cache: "no-store", signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Bill records could not be loaded.");
        if (active) {
          setBills(data.bills || []);
          setSummary(data.summary);
          setBusiness(data.settings?.business || null);
          setError("");
          hasLoadedRef.current = true;
        }
      } catch (reason) {
        if (active && reason.name !== "AbortError") setError(reason.message || "Bill records could not be loaded.");
      } finally {
        if (active) {
          isFetchingRef.current = false;
          setLoading(false);
        }
      }
    }, 220);
    return () => { active = false; isFetchingRef.current = false; window.clearTimeout(timer); controller.abort(); };
  }, [search, from, to, page, refreshTick]);

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible" && !isFetchingRef.current) {
        setRefreshTick((tick) => tick + 1);
      }
    };
    const interval = window.setInterval(refresh, 30_000);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  const exportQuery = useMemo(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    return params.toString();
  }, [search, from, to]);

  const exportCsv = async () => {
    setExporting(true);
    setError("");
    try {
      await downloadCsvFile(`/api/bills/export${exportQuery ? `?${exportQuery}` : ""}`);
    } catch (reason) {
      setError(reason.message || "Bill report could not be downloaded.");
    } finally {
      setExporting(false);
    }
  };

  const downloadPdf = async (bill) => {
    const { downloadBillPdf } = await import("@/lib/billing/billPdfGenerator");
    downloadBillPdf(bill, bill.seller_snapshot || business || {});
  };
  const exportReport = async () => {
    const { downloadBillReportPdf } = await import("@/lib/billing/billReportPdfGenerator");
    downloadBillReportPdf(summary || {}, { from, to, search }, business || {});
  };

  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-xs font-bold uppercase tracking-wide text-blue-700">{hi ? "बिल रिपोर्ट" : "Billing"}</p><h1 className="text-2xl font-black text-slate-900">{hi ? "बिल देखें और रिपोर्ट" : "Bills & reports"}</h1></div>
        <button type="button" onClick={onBack} className="min-h-10 rounded-lg border border-slate-300 bg-white px-3.5 text-sm font-semibold text-slate-700">← {hi ? "डैशबोर्ड" : "Dashboard"}</button>
      </header>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Bill totals">
        {[[hi ? "कुल बिल" : "Bills", summary?.bill_count ?? "—"], [hi ? "कुल GST" : "GST total", summary ? formatINR(summary.tax_total) : "—"], [hi ? "कुल राशि" : "Grand total", summary ? formatINR(summary.grand_total) : "—"]].map(([label, value]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 text-xl font-black text-slate-900">{value}</p></div>)}
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-xs font-semibold text-slate-600 lg:col-span-2">{hi ? "बिल नंबर, नाम या मोबाइल से खोजें" : "Search bill number, customer or mobile"}<input value={search} onChange={(event) => { setPage(0); setSearch(event.target.value); }} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm" /></label>
          <label className="text-xs font-semibold text-slate-600">{hi ? "शुरू तारीख" : "From date"}<input type="date" value={from} onChange={(event) => { setPage(0); setFrom(event.target.value); }} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm" /></label>
          <label className="text-xs font-semibold text-slate-600">{hi ? "अंतिम तारीख" : "To date"}<input type="date" value={to} onChange={(event) => { setPage(0); setTo(event.target.value); }} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm" /></label>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setRefreshTick((tick) => tick + 1)} disabled={loading} className="inline-flex min-h-10 items-center rounded-lg border border-slate-300 px-3.5 text-sm font-bold text-slate-800 disabled:opacity-50">{hi ? "अभी Refresh करें" : "Refresh now"}</button>
          <button type="button" onClick={exportCsv} disabled={exporting} className="inline-flex min-h-10 items-center rounded-lg bg-slate-900 px-3.5 text-sm font-bold text-white disabled:opacity-50">{exporting ? (hi ? "डाउनलोड हो रहा है…" : "Exporting…") : (hi ? "Excel CSV डाउनलोड" : "Export Excel CSV")}</button>
          <span className="self-center text-xs text-slate-500">{hi ? "सूची 30 सेकंड में अपने आप अपडेट होती है।" : "The list refreshes automatically every 30 seconds."}</span>
          <button type="button" onClick={exportReport} disabled={!summary} className="min-h-10 rounded-lg border border-slate-300 px-3.5 text-sm font-bold text-slate-800 disabled:opacity-50">{hi ? "रिपोर्ट PDF" : "Report PDF"}</button>
        </div>
      </section>

      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
      {loading ? <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">{hi ? "बिल लोड हो रहे हैं…" : "Loading bills…"}</p> : !bills.length ? <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">{hi ? "इस फ़िल्टर के लिए कोई बिल नहीं मिला।" : "No bills match these filters."}</p> : (
        <div className="space-y-3">{bills.map((bill, index) => {
          const serialNumber = page * PAGE_SIZE + index + 1;
          return <details key={bill.id} className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-3">
                <span className="inline-flex shrink-0 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700">{hi ? `क्रमांक ${serialNumber}` : `S.No. ${serialNumber}`}</span>
                <span className="min-w-0"><b className="block text-sm text-slate-900">{bill.bill_number}</b><span className="text-xs text-slate-500">{bill.invoice_date} · {bill.customer_name} · {bill.customer_mobile}</span></span>
              </span>
              <span className="flex items-center gap-2"><b className="text-sm text-slate-900">{formatINR(bill.grand_total)}</b><span aria-hidden="true" className="text-slate-400">⌄</span></span>
            </summary>
            <div className="mt-3 border-t border-slate-200 pt-3">
              {bill.customer_address && <p className="mb-2 text-xs text-slate-600">{bill.customer_address}</p>}
              <div className="space-y-2">{(bill.items || []).map((item, index) => <div key={item.id} className="flex flex-wrap justify-between gap-2 text-xs"><span className="flex items-center gap-2"><span className="inline-flex size-5 shrink-0 items-center justify-center rounded bg-slate-100 text-[10px] font-bold text-slate-600">{item.line_number || index + 1}</span><span>{item.product_name} × {item.quantity} ({item.gst_rate}% GST)</span></span><b>{formatINR(item.line_total)}</b></div>)}</div>
              <button type="button" onClick={() => downloadPdf(bill)} className="mt-3 min-h-9 rounded-lg border border-slate-300 px-3 text-xs font-bold text-slate-700 hover:bg-slate-50">{hi ? "A4 PDF डाउनलोड" : "Download A4 PDF"}</button>
            </div>
          </details>;
        })}</div>
      )}

      <div className="flex items-center justify-between gap-3">
        <button type="button" disabled={page === 0 || loading} onClick={() => setPage((current) => current - 1)} className="min-h-10 rounded-lg border border-slate-300 px-3 text-sm disabled:opacity-50">← {hi ? "पिछला" : "Previous"}</button>
        <span className="text-xs text-slate-500">{hi ? `पेज ${page + 1}` : `Page ${page + 1}`}</span>
        <button type="button" disabled={loading || bills.length < PAGE_SIZE} onClick={() => setPage((current) => current + 1)} className="min-h-10 rounded-lg border border-slate-300 px-3 text-sm disabled:opacity-50">{hi ? "अगला" : "Next"} →</button>
      </div>
    </section>
  );
}
