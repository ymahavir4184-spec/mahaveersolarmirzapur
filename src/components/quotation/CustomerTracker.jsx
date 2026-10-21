"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { generateMaterialQuotationPdf } from "../../lib/quotation/quotationPdfGenerator.js";
import { generateMaterialList, getSystemSummary } from "../../lib/quotation/materialCalculator.js";
import { siteConfig } from "../../config/site.js";

/**
 * =============================================================================
 * CUSTOMER TRACKER COMPONENT (CRM / Lead & Purchase Tracker)
 * =============================================================================
 * Universal software interface for tracking customer quotations:
 * - Search by name / phone
 * - Filter by status (All, Pending, Product Taken)
 * - Checkbox to mark "Product Taken / सामान ले लिया" with instant DB sync
 * - One-click WhatsApp & PDF download
 * =============================================================================
 */
export default function CustomerTracker({ onNewQuotation, lang = "hi" }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "pending" | "completed"
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  // Fetch all customer records
  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/quotations");
      const data = await res.json();
      if (!res.ok || !data.success || !Array.isArray(data.data)) throw new Error(data.message || "Could not load quotation records.");
      setRecords(data.data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch tracker records:", err);
      setError(err.message || (lang === "hi" ? "रिकॉर्ड लोड नहीं हो पाए।" : "Could not load quotation records."));
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Toggle "Product Taken / सामान ले लिया" checkbox
  const handleTogglePurchased = async (record) => {
    const newIsPurchased = !record.isPurchased;
    setUpdatingId(record.id);

    // Optimistic UI update
    setRecords((prev) =>
      prev.map((r) =>
        r.id === record.id
          ? {
              ...r,
              isPurchased: newIsPurchased,
              status: newIsPurchased ? "completed" : "pending",
              completedAt: newIsPurchased ? new Date().toISOString() : null,
            }
          : r
      )
    );

    try {
      const res = await fetch("/api/quotations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: record.id,
          isPurchased: newIsPurchased,
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || "Could not update quotation status.");
      setRecords((prev) => prev.map((entry) => entry.id === record.id ? result.data : entry));
    } catch (err) {
      console.error("Failed to update status:", err);
      await fetchRecords();
      setError(err.message || (lang === "hi" ? "स्थिति अपडेट नहीं हो पाई।" : "Could not update status."));
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete record
  const handleDelete = async (id, name) => {
    const confirmMsg =
      lang === "hi"
        ? `क्या आप सच में "${name}" का रिकॉर्ड हटाना चाहते हैं?`
        : `Are you sure you want to delete the record for "${name}"?`;

    if (!window.confirm(confirmMsg)) return;

    setRecords((prev) => prev.filter((r) => r.id !== id));

    try {
      const response = await fetch(`/api/quotations?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Could not delete quotation.");
    } catch (err) {
      console.error("Failed to delete record:", err);
      await fetchRecords();
      setError(err.message || (lang === "hi" ? "रिकॉर्ड नहीं हट पाया।" : "Could not delete quotation."));
    }
  };

  // Re-generate & download PDF for a saved customer
  const handleDownloadPdf = (record) => {
    try {
      const capacityKw = Number(record.capacityKw) || 5;
      const systemType = record.systemType || "on-grid";
      const panelWatt = Number(record.panelWatt) || 550;

      const materials = generateMaterialList({
        capacityKw,
        systemType,
        panelWatt,
        roofType: record.roofType || "rcc",
      });

      const summary = getSystemSummary({
        capacityKw,
        systemType,
        panelWatt,
      });

      const doc = generateMaterialQuotationPdf({
        customerName: record.customerName || "Customer",
        customerMobile: record.customerMobile || "",
        customerAddress: record.customerAddress || "",
        quotationRef: record.quotationRef || "",
        quotationDate: record.createdAt || "",
        propertyType: record.propertyType || "residential",
        roofType: record.roofType || "rcc",
        capacityKw,
        systemType,
        materials,
        summary,
        notes: record.notes || "",
        lang,
      });

      const cleanName = (record.customerName || "Customer").replace(/[^a-zA-Z0-9]/g, "_");
      doc.save(`Mahaveer_Enterprises_${cleanName}_${capacityKw}kW.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF generation failed.");
    }
  };

  // Open WhatsApp chat directly
  const handleOpenWhatsApp = (record) => {
    const mobile = (record.customerMobile || "").replace(/\D/g, "");
    if (!mobile || mobile.length < 10) {
      alert("Invalid mobile number.");
      return;
    }

    const cleanMobile = mobile.slice(-10);
    const customerName = record.customerName || "ग्राहक";
    const capacity = record.capacityKw || 5;
    const sysType = record.systemType || "on-grid";

    const msg =
      lang === "hi"
        ? `नमस्ते ${customerName} जी! ☀️\n${siteConfig.company.legalName} (मिर्जापुर) की ओर से आपके ${capacity} kW (${sysType}) सोलर सिस्टम कोटेशन के संबंध में।\n\nसंपर्क: ${siteConfig.company.displayPhone}\n${siteConfig.company.address}`
        : `Hello ${customerName} ji! ☀️\nRegarding your ${capacity} kW (${sysType}) Solar Quotation from ${siteConfig.company.legalName} (Mirzapur).\n\nContact: ${siteConfig.company.displayPhone}\n${siteConfig.company.address}`;

    window.open(`https://wa.me/91${cleanMobile}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Status filter
      if (statusFilter === "pending" && r.isPurchased) return false;
      if (statusFilter === "completed" && !r.isPurchased) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = (r.customerName || "").toLowerCase().includes(q);
        const mobileMatch = (r.customerMobile || "").includes(q);
        const refMatch = (r.quotationRef || "").toLowerCase().includes(q);
        const addressMatch = (r.customerAddress || "").toLowerCase().includes(q);
        return nameMatch || mobileMatch || refMatch || addressMatch;
      }
      return true;
    });
  }, [records, statusFilter, searchQuery]);

  const totalCount = records.length;
  const completedCount = records.filter((r) => r.isPurchased).length;
  const pendingCount = totalCount - completedCount;

  return (
    <div className="space-y-6">
      {/* ─── Top Stats Summary Bar ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Quotations */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {lang === "hi" ? "कुल कोटेशन" : "Total Quotations"}
            </div>
            <div className="text-3xl font-black text-slate-900 mt-1">{totalCount}</div>
            <div className="text-xs text-slate-400 mt-0.5">
              {lang === "hi" ? "डेटाबेस में सुरक्षित" : "Saved in Database"}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
            📋
          </div>
        </div>

        {/* Product Taken (Closed Deals) */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              {lang === "hi" ? "सामान ले लिया (Done)" : "Product Delivered / Sold"}
            </div>
            <div className="text-3xl font-black text-emerald-600 mt-1">{completedCount}</div>
            <div className="text-xs text-emerald-600/80 mt-0.5">
              {totalCount > 0 ? `${Math.round((completedCount / totalCount) * 100)}% Conversion` : "0%"}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold">
            ✅
          </div>
        </div>

        {/* Pending Follow-up */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              {lang === "hi" ? "प्रगति में (Pending)" : "Pending Follow-up"}
            </div>
            <div className="text-3xl font-black text-amber-600 mt-1">{pendingCount}</div>
            <div className="text-xs text-amber-600/80 mt-0.5">
              {lang === "hi" ? "फॉलो-अप अपेक्षित" : "Follow-up required"}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl font-bold">
            ⏳
          </div>
        </div>
      </div>

      {error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>}

      {/* ─── Controls: Search & Status Filters ─────────────────────────────── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === "hi"
                ? "ग्राहक का नाम, मोबाइल नंबर या रिफ. खोजें..."
                : "Search by customer name, mobile or ref..."
            }
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start md:self-center">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === "all"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {lang === "hi" ? "सभी" : "All"} ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("pending")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === "pending"
                ? "bg-white text-amber-700 shadow-sm"
                : "text-slate-600 hover:text-amber-700"
            }`}
          >
            ⏳ {lang === "hi" ? "प्रगति में" : "Pending"} ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("completed")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === "completed"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-emerald-700"
            }`}
          >
            ✅ {lang === "hi" ? "ले लिया" : "Delivered"} ({completedCount})
          </button>
        </div>
      </div>

      {/* ─── Customer Records Table (Software UI) ─────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-500 border-t-transparent mx-auto mb-3" />
            <span className="text-sm font-semibold">
              {lang === "hi" ? "रिकॉर्ड लोड हो रहे हैं..." : "Loading records..."}
            </span>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="text-4xl">📂</div>
            <h3 className="text-base font-bold text-slate-800">
              {records.length === 0
                ? lang === "hi"
                  ? "अभी कोई कोटेशन रिकॉर्ड नहीं है"
                  : "No quotation records found"
                : lang === "hi"
                ? "इस फ़िल्टर में कोई रिकॉर्ड नहीं मिला"
                : "No matching records found"}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {lang === "hi"
                ? "नया कोटेशन बनाने के बाद ग्राहक का विवरण और सामान की स्थिति यहाँ स्वतः सुरक्षित हो जाएगी।"
                : "Generate a quotation in the wizard to track customer details and purchase status here."}
            </p>
            {onNewQuotation && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onNewQuotation}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  <span>➕</span>
                  <span>{lang === "hi" ? "नया कोटेशन बनाएं" : "Create New Quotation"}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              {/* Table Header */}
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 text-center w-28">
                    {lang === "hi" ? "सामान ले लिया?" : "Product Taken?"}
                  </th>
                  <th className="py-3.5 px-4">{lang === "hi" ? "तारीख / Ref" : "Date / Ref"}</th>
                  <th className="py-3.5 px-4">{lang === "hi" ? "ग्राहक विवरण" : "Customer Details"}</th>
                  <th className="py-3.5 px-4">{lang === "hi" ? "सोलर क्षमता" : "Solar System"}</th>
                  <th className="py-3.5 px-4">{lang === "hi" ? "स्थिति" : "Status"}</th>
                  <th className="py-3.5 px-4 text-right">{lang === "hi" ? "कार्य (Actions)" : "Actions"}</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((r) => {
                  const isDone = Boolean(r.isPurchased);
                  const isBeingUpdated = updatingId === r.id;

                  const formattedDate = new Date(r.createdAt || Date.now()).toLocaleDateString(
                    lang === "hi" ? "hi-IN" : "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  );

                  return (
                    <tr
                      key={r.id}
                      className={`transition-colors hover:bg-slate-50/80 ${
                        isDone ? "bg-emerald-50/30" : ""
                      }`}
                    >
                      {/* Checkbox Column */}
                      <td className="py-3.5 px-4 text-center">
                        <label className="inline-flex items-center justify-center gap-1.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isDone}
                            disabled={isBeingUpdated}
                            onChange={() => handleTogglePurchased(r)}
                            className="w-5 h-5 rounded-md border-2 border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer transition-all"
                          />
                        </label>
                      </td>

                      {/* Date & Ref */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">{formattedDate}</div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                          {r.quotationRef || "—"}
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm">{r.customerName}</div>
                        <div className="text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                          <span>📞</span>
                          <span>+91 {r.customerMobile}</span>
                        </div>
                        {r.customerAddress && (
                          <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">
                            📍 {r.customerAddress}
                          </div>
                        )}
                      </td>

                      {/* System Spec */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 font-bold text-slate-800 text-xs">
                          <span>⚡</span>
                          <span>{r.capacityKw} kW</span>
                          <span className="text-slate-400 font-normal">|</span>
                          <span className="capitalize">{r.systemType}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          {r.panelCount ? `${r.panelCount} Panels` : ""}
                          {r.roofType ? ` • ${r.roofType.toUpperCase()} Roof` : ""}
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        {isDone ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                            <span>✓</span>
                            <span>{lang === "hi" ? "सामान ले लिया" : "Delivered"}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                            <span>⏳</span>
                            <span>{lang === "hi" ? "प्रगति में" : "Pending"}</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          {/* WhatsApp Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenWhatsApp(r)}
                            title="Chat on WhatsApp"
                            className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                          >
                            <span className="text-sm">💬</span>
                          </button>

                          {/* PDF Download Button */}
                          <button
                            type="button"
                            onClick={() => handleDownloadPdf(r)}
                            title="Download Quotation PDF"
                            className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors"
                          >
                            <span className="text-sm">📄</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDelete(r.id, r.customerName)}
                            title="Delete Record"
                            className="p-2 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 hover:border-red-200 transition-colors"
                          >
                            <span className="text-sm">🗑️</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-right text-xs text-slate-400 flex items-center justify-between px-1">
        <div>
          <span>🏢 {siteConfig.company.legalName || siteConfig.company.name}</span>
          <span className="mx-2">•</span>
          <span>📍 {siteConfig.company.address}</span>
        </div>
        <div>
          <span>Database Store: </span>
          <span className="font-semibold text-emerald-600">Active ✓</span>
        </div>
      </div>
    </div>
  );
}
