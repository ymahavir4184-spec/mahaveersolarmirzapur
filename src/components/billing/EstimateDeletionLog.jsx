"use client";

import { useEffect, useState } from "react";
import { formatINR } from "@/lib/billing/billMath";

const PAGE_SIZE = 50;

export default function EstimateDeletionLog({ lang = "hi", onBack }) {
  const hi = lang === "hi";
  const [logs, setLogs] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [refreshTick, setRefreshTick] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(page * PAGE_SIZE) });
    setLoading(true);
    setError("");
    fetch(`/api/estimates/deletion-log?${params}`, { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.message || "Deletion log could not be loaded.");
        setLogs(data.logs || []);
        setCount(Number(data.count || 0));
      })
      .catch((reason) => {
        if (reason.name !== "AbortError") setError(reason.message || "Deletion log could not be loaded.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [page, refreshTick]);

  return (
    <main className="mx-auto max-w-5xl space-y-5 px-4 py-5 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-amber-700">{hi ? "Estimate report" : "Estimate report"}</p>
          <h1 className="text-2xl font-black text-slate-900">Estimate Delete Report</h1>
          <p className="mt-1 text-sm text-slate-600">{hi ? "Deleted estimate ka receipt, customer, amount, staff login ID aur delete date/time yahan milenge. Password log nahi hota." : "See deleted estimate receipts, customer, amount, staff login ID, and deletion date/time. Passwords are never logged."}</p>
        </div>
        <button type="button" onClick={onBack} className="min-h-10 rounded-lg border border-slate-300 bg-white px-3.5 text-sm font-semibold text-slate-700">← {hi ? "Dashboard" : "Dashboard"}</button>
      </header>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600">{hi ? "Delete report database se load hota hai aur sab devices par same rahega." : "The delete report loads from the database and stays in sync across devices."}</p>
          <button type="button" onClick={() => setRefreshTick((tick) => tick + 1)} disabled={loading} className="min-h-10 rounded-lg border border-slate-300 px-3.5 text-sm font-bold text-slate-700 disabled:opacity-50">{hi ? "Refresh report" : "Refresh report"}</button>
        </header>

      {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
      {loading ? <p className="text-sm text-slate-500">{hi ? "Log load ho raha hai…" : "Loading log…"}</p> : !logs.length ? <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">{hi ? "Abhi koi estimate delete nahi hua." : "No estimates have been deleted yet."}</p> : (
        <div className="space-y-2">
          {logs.map((entry, index) => (
            <article key={entry.audit_id} className="rounded-xl border border-slate-200 p-3 sm:p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex min-w-0 items-start gap-2.5">
                  <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs font-black text-slate-600">{page * PAGE_SIZE + index + 1}</span>
                  <div className="min-w-0">
                    <p className="break-all text-sm font-black text-slate-900">{entry.estimate_number}</p>
                    <p className="mt-0.5 text-sm text-slate-600">{entry.customer_name} · {entry.estimate_date}</p>
                  </div>
                </div>
                <p className="text-sm font-black text-slate-900">{formatINR(entry.grand_total)}</p>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600 sm:grid-cols-2">
                <p><span className="font-bold">{hi ? "Deleted by / Login ID:" : "Deleted by / Login ID:"}</span> {entry.deleted_by}</p>
                <p><span className="font-bold">{hi ? "Date & time:" : "Date & time:"}</span> {new Date(entry.deleted_at).toLocaleString(hi ? "hi-IN" : "en-IN")}</p>
              </div>
            </article>
          ))}
        </div>
      )}

      <footer className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <button type="button" disabled={page === 0 || loading} onClick={() => setPage((value) => value - 1)} className="min-h-9 rounded-lg border border-slate-300 px-3 text-sm disabled:opacity-50">← {hi ? "Previous" : "Previous"}</button>
        <span className="text-xs text-slate-500">{hi ? `Page ${page + 1} · ${count} total` : `Page ${page + 1} · ${count} total`}</span>
        <button type="button" disabled={loading || (page + 1) * PAGE_SIZE >= count} onClick={() => setPage((value) => value + 1)} className="min-h-9 rounded-lg border border-slate-300 px-3 text-sm disabled:opacity-50">{hi ? "Next" : "Next"} →</button>
      </footer>
      </section>
    </main>
  );
}
