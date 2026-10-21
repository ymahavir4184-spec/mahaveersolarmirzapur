"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { formatINR } from "@/lib/billing/billMath";
import { downloadCsvFile } from "@/lib/billing/csv";

const PAGE_SIZE = 50;

export default function EstimateRecords({ lang = "hi", onBack }) {
  const hi = lang === "hi";
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(0);
  const [estimates, setEstimates] = useState([]);
  const [summary, setSummary] = useState(null);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exporting, setExporting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);
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
        const response = await fetch(`/api/estimates?${params}`, { cache: "no-store", signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Estimate records could not be loaded.");
        if (active) {
          setEstimates(data.estimates || []);
          setSummary(data.summary || null);
          setBusiness(data.settings?.business || null);
          setError("");
          hasLoadedRef.current = true;
        }
      } catch (reason) {
        if (active && reason.name !== "AbortError") setError(reason.message || "Estimate records could not be loaded.");
      } finally {
        if (active) {
          isFetchingRef.current = false;
          setLoading(false);
        }
      }
    }, search.trim() ? 220 : 0);
    return () => { active = false; isFetchingRef.current = false; window.clearTimeout(timer); controller.abort(); };
  }, [search, from, to, page, refreshTick]);

  useEffect(() => {
    const refresh = () => {
      if (hasLoadedRef.current && document.visibilityState === "visible" && !isFetchingRef.current) {
        setRefreshTick((tick) => tick + 1);
      }
    };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
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
      await downloadCsvFile(`/api/estimates/export${exportQuery ? `?${exportQuery}` : ""}`);
    } catch (reason) {
      setError(reason.message || "Estimate report could not be downloaded.");
    } finally {
      setExporting(false);
    }
  };

  const downloadPdf = async (estimate) => {
    const { downloadEstimatePdf } = await import("@/lib/billing/estimatePdfGenerator");
    downloadEstimatePdf(estimate, estimate.seller_snapshot || business || {});
  };

  const startDelete = (estimate) => {
    setDeleteTarget(estimate);
    setDeletePassword("");
    setDeleteConfirmation("");
    setDeleteError("");
  };

  const closeDelete = () => {
    if (deleting) return;
    setDeleteTarget(null);
    setDeletePassword("");
    setDeleteConfirmation("");
    setDeleteError("");
  };

  const deleteEstimate = async (event) => {
    event.preventDefault();
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    setDeleteError("");
    try {
      const response = await fetch("/api/estimates/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          estimateId: deleteTarget.id,
          confirmation: deleteConfirmation,
          masterPassword: deletePassword,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 404) setRefreshTick((tick) => tick + 1);
        throw new Error(data.message || "Estimate could not be deleted.");
      }
      setEstimates((current) => current.filter((estimate) => estimate.id !== deleteTarget.id));
      setSummary((current) => current ? {
        ...current,
        estimate_count: Math.max(0, Number(current.estimate_count || 0) - 1),
        visible_tax_total: Math.max(0, Number(current.visible_tax_total || 0) - Number(deleteTarget.tax_total || 0)),
        visible_grand_total: Math.max(0, Number(current.visible_grand_total || 0) - Number(deleteTarget.grand_total || 0)),
      } : current);
      setDeleteTarget(null);
      setDeletePassword("");
      setDeleteConfirmation("");
      setRefreshTick((tick) => tick + 1);
    } catch (reason) {
      setDeleteError(reason.message || "Estimate could not be deleted.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-amber-700">{hi ? "एस्टिमेट ट्रैकर" : "Estimate tracker"}</p>
          <h1 className="text-2xl font-black text-slate-900">{hi ? "Estimate Records" : "Estimate records"}</h1>
          <p className="mt-1 text-sm text-slate-600">{hi ? "यह सूची केवल estimates की है; बिल रिकॉर्ड अलग रहते हैं।" : "This list contains estimates only; bill records remain separate."}</p>
        </div>
        <button type="button" onClick={onBack} className="min-h-10 rounded-lg border border-slate-300 bg-white px-3.5 text-sm font-semibold text-slate-700">← {hi ? "डैशबोर्ड" : "Dashboard"}</button>
      </header>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label={hi ? "Estimate totals" : "Estimate totals"}>
        {[
          [hi ? "कुल मिले Estimates" : "Matching estimates", summary?.estimate_count ?? "—"],
          [hi ? "इस पेज का GST" : "GST on this page", summary ? formatINR(summary.visible_tax_total) : "—"],
          [hi ? "इस पेज की कुल राशि" : "Total on this page", summary ? formatINR(summary.visible_grand_total) : "—"],
        ].map(([label, value]) => <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><p className="text-xs font-semibold text-slate-500">{label}</p><p className="mt-1 text-xl font-black text-slate-900">{value}</p></div>)}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-xs font-semibold text-slate-600 lg:col-span-2">{hi ? "Estimate नंबर, ग्राहक या मोबाइल खोजें" : "Search estimate number, customer or mobile"}<input value={search} onChange={(event) => { setPage(0); setSearch(event.target.value); }} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm" /></label>
          <label className="text-xs font-semibold text-slate-600">{hi ? "शुरू तारीख" : "From date"}<input type="date" value={from} onChange={(event) => { setPage(0); setFrom(event.target.value); }} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm" /></label>
          <label className="text-xs font-semibold text-slate-600">{hi ? "अंतिम तारीख" : "To date"}<input type="date" value={to} onChange={(event) => { setPage(0); setTo(event.target.value); }} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm" /></label>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => setRefreshTick((tick) => tick + 1)} disabled={loading} className="inline-flex min-h-10 items-center rounded-lg border border-slate-300 px-3.5 text-sm font-bold text-slate-800 disabled:opacity-50">{hi ? "अभी Refresh करें" : "Refresh now"}</button>
          <button type="button" onClick={exportCsv} disabled={exporting} className="inline-flex min-h-10 items-center rounded-lg bg-slate-900 px-3.5 text-sm font-bold text-white disabled:opacity-50">{exporting ? (hi ? "डाउनलोड हो रहा है…" : "Exporting…") : (hi ? "Excel CSV डाउनलोड" : "Export Excel CSV")}</button>
          <span className="self-center text-xs text-slate-500">{hi ? "नए एस्टिमेट देखने के लिए Refresh करें।" : "Refresh to check for new estimates."}</span>
        </div>
      </section>

      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}
      {loading ? <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">{hi ? "Estimates लोड हो रहे हैं…" : "Loading estimates…"}</p> : !estimates.length ? <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">{hi ? "इस खोज या तारीख के लिए कोई estimate नहीं मिला।" : "No estimates match these filters."}</p> : (
        <div className="space-y-3">{estimates.map((estimate, index) => {
          const serialNumber = page * PAGE_SIZE + index + 1;
          return <details key={estimate.id} className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-3">
              <span className="flex min-w-0 items-center gap-3">
                <span className="inline-flex shrink-0 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-800">{hi ? `क्रमांक ${serialNumber}` : `S.No. ${serialNumber}`}</span>
                <span className="min-w-0"><b className="block text-sm text-slate-900">{estimate.estimate_number}</b><span className="text-xs text-slate-500">{estimate.estimate_date} · {estimate.customer_name} · {estimate.customer_mobile}</span></span>
              </span>
              <span className="flex items-center gap-2"><b className="text-sm text-slate-900">{formatINR(estimate.grand_total)}</b><span aria-hidden="true" className="text-slate-400">⌄</span></span>
            </summary>
            <div className="mt-3 border-t border-slate-200 pt-3">
              {estimate.customer_address && <p className="mb-2 whitespace-pre-line text-xs text-slate-600">{estimate.customer_address}</p>}
              <div className="space-y-2">{(estimate.items || []).map((item, index) => <div key={`${estimate.id}-${item.line_number || index}`} className="flex flex-wrap justify-between gap-2 text-xs"><span className="flex items-center gap-2"><span className="inline-flex size-5 shrink-0 items-center justify-center rounded bg-slate-100 text-[10px] font-bold text-slate-600">{item.line_number || index + 1}</span><span>{item.product_name} × {item.quantity}{item.unit ? ` ${item.unit}` : ""} ({item.gst_rate}% GST)</span></span><b>{formatINR(item.line_total)}</b></div>)}</div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600"><span>{hi ? "स्थिति: Supabase में सेव" : "Status: Saved to Supabase"} · {estimate.tax_mode === "none" ? (hi ? "No GST" : "No GST") : estimate.tax_mode === "intra" ? "CGST + SGST" : "IGST"}</span><div className="flex flex-wrap gap-2"><button type="button" onClick={() => downloadPdf(estimate)} className="min-h-9 rounded-lg border border-slate-300 px-3 text-xs font-bold text-slate-700 hover:bg-slate-50">{hi ? "A4 Estimate PDF डाउनलोड" : "Download A4 estimate PDF"}</button><button type="button" onClick={() => startDelete(estimate)} className="min-h-9 rounded-lg border border-red-300 bg-white px-3 text-xs font-bold text-red-700 hover:bg-red-50">{hi ? "Estimate हटाएँ" : "Delete estimate"}</button></div></div>
            </div>
          </details>;
        })}</div>
      )}

      <div className="flex items-center justify-between gap-3">
        <button type="button" disabled={page === 0 || loading} onClick={() => setPage((current) => current - 1)} className="min-h-10 rounded-lg border border-slate-300 px-3 text-sm disabled:opacity-50">← {hi ? "पिछला" : "Previous"}</button>
        <span className="text-xs text-slate-500">{hi ? `पेज ${page + 1}` : `Page ${page + 1}`}</span>
        <button type="button" disabled={loading || estimates.length < PAGE_SIZE} onClick={() => setPage((current) => current + 1)} className="min-h-10 rounded-lg border border-slate-300 px-3 text-sm disabled:opacity-50">{hi ? "अगला" : "Next"} →</button>
      </div>

      {deleteTarget && <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/55 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDelete(); }}>
        <form role="dialog" aria-modal="true" aria-labelledby="estimate-delete-title" onSubmit={deleteEstimate} className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-red-700">{hi ? "संवेदनशील कार्रवाई" : "Sensitive action"}</p>
            <h2 id="estimate-delete-title" className="mt-1 text-lg font-black text-slate-900">{hi ? "Estimate हटाएँ?" : "Delete estimate?"}</h2>
            <p className="mt-2 break-all text-sm font-semibold text-slate-700">{deleteTarget.estimate_number} · {deleteTarget.customer_name}</p>
            <p className="mt-2 text-sm text-slate-600">{hi ? "Estimate permanently remove hoga. Sirf receipt, customer, amount, staff ID aur delete time ka compact log rahega; full recovery copy nahi banegi." : "This estimate will be removed permanently. Only a compact receipt, customer, amount, staff ID, and deletion-time log is kept; no recovery copy is made."}</p>
          </div>
          <label className="block text-sm font-semibold text-slate-700">{hi ? "Delete ke liye master password (max 128 characters)" : "Enter the master password for the delete (up to 128 characters)"}
            <input type="password" autoComplete="new-password" required maxLength={128} value={deletePassword} onChange={(event) => setDeletePassword(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm" />
          </label>
          <label className="block text-sm font-semibold text-slate-700">{hi ? "पुष्टि के लिए Estimate नंबर फिर से लिखें" : "Type the estimate number to confirm"}
            <input type="text" autoComplete="off" required value={deleteConfirmation} onChange={(event) => setDeleteConfirmation(event.target.value)} className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm" />
          </label>
          {deleteError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{deleteError}</p>}
          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" onClick={closeDelete} disabled={deleting} className="min-h-10 rounded-lg border border-slate-300 px-3.5 text-sm font-bold text-slate-700 disabled:opacity-50">{hi ? "रद्द करें" : "Cancel"}</button>
            <button type="submit" disabled={deleting || deleteConfirmation.trim() !== deleteTarget.estimate_number} className="min-h-10 rounded-lg bg-red-700 px-3.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{deleting ? (hi ? "हटाया जा रहा है…" : "Deleting…") : (hi ? "Delete & log" : "Delete & log")}</button>
          </div>
        </form>
      </div>}
    </section>
  );
}
