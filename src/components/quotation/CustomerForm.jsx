"use client";

import React, { useState } from "react";
import { quotationText } from "../../lib/quotation/quotationTranslations.js";

/**
 * =============================================================================
 * STEP 3: CUSTOMER FORM COMPONENT (Software Light Theme)
 * =============================================================================
 * Collects customer details needed for the official quotation:
 * - Customer full name (required)
 * - Mobile number (required, 10 digits)
 * - Installation address / location (required)
 * - Property type (residential, commercial, industrial)
 * - Roof type (rcc, metalSheet, tiled)
 * - Additional notes (optional)
 *
 * Saves record directly to the quotation tracker database on submit.
 * =============================================================================
 */
export default function CustomerForm({
  customerData,
  setCustomerData,
  capacityKw = 5,
  systemType = "on-grid",
  panelWatt = 550,
  panelCount = 10,
  existingQuotation = null,
  onNext,
  onPrev,
  lang = "hi",
}) {
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const tx = (key) => quotationText[key]?.[lang] || quotationText[key]?.en || "";

  const handleChange = (field, value) => {
    setCustomerData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!customerData.name || customerData.name.trim().length < 2) {
      newErrors.name = lang === "hi" ? "कृपया ग्राहक का नाम दर्ज करें" : "Customer name is required";
    }

    const cleanMobile = (customerData.mobile || "").replace(/\D/g, "");
    if (!cleanMobile || cleanMobile.length < 10) {
      newErrors.mobile = lang === "hi" ? "कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें" : "Valid 10-digit mobile number required";
    }

    if (!customerData.address || customerData.address.trim().length < 3) {
      newErrors.address = lang === "hi" ? "कृपया साइट का पता दर्ज करें" : "Installation address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaveError("");
    setIsSaving(true);
    try {
      // Save customer record to database tracker
      const response = await fetch("/api/quotations", {
        method: existingQuotation?.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(existingQuotation?.id ? { id: existingQuotation.id } : {}),
          customerName: customerData.name,
          customerMobile: customerData.mobile,
          customerAddress: customerData.address,
          capacityKw: Number(capacityKw) || 5,
          systemType,
          propertyType: customerData.propertyType || "residential",
          roofType: customerData.roofType || "rcc",
          panelWatt: Number(panelWatt) || 550,
          panelCount: Number(panelCount) || 10,
          notes: customerData.notes || "",
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Could not save quotation.");
      onNext(result.data);
    } catch (error) {
      setSaveError(error.message || (lang === "hi" ? "कोटेशन सेव नहीं हो पाया।" : "Could not save quotation."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Info */}
      <div className="border-b border-slate-200 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold mb-2">
          <span>👤</span>
          <span>Step 3 of 4 • {tx("step3Title")}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {tx("step3Title")}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          {tx("step3Subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Customer Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {tx("customerName")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={customerData.name || ""}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder={tx("customerNamePlaceholder")}
            className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all ${
              errors.name ? "border-red-500 ring-1 ring-red-500" : "border-slate-300"
            }`}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <span>⚠️</span> {errors.name}
            </p>
          )}
        </div>

        {/* Customer Mobile */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {tx("customerMobile")} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              +91
            </span>
            <input
              type="tel"
              required
              maxLength={10}
              value={customerData.mobile || ""}
              onChange={(e) => handleChange("mobile", e.target.value.replace(/\D/g, ""))}
              placeholder={tx("customerMobilePlaceholder")}
              className={`w-full pl-12 pr-3.5 py-2.5 bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all ${
                errors.mobile ? "border-red-500 ring-1 ring-red-500" : "border-slate-300"
              }`}
            />
          </div>
          {errors.mobile && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <span>⚠️</span> {errors.mobile}
            </p>
          )}
        </div>

        {/* Installation Address */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {tx("customerAddress")} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={customerData.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder={tx("customerAddressPlaceholder")}
            className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all ${
              errors.address ? "border-red-500 ring-1 ring-red-500" : "border-slate-300"
            }`}
          />
          {errors.address && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <span>⚠️</span> {errors.address}
            </p>
          )}
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {tx("propertyType")}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "residential", label: tx("residential"), icon: "🏠" },
              { id: "commercial", label: tx("commercial"), icon: "🏢" },
              { id: "industrial", label: tx("industrial"), icon: "🏭" },
            ].map((prop) => {
              const isSelected = (customerData.propertyType || "residential") === prop.id;
              return (
                <button
                  key={prop.id}
                  type="button"
                  onClick={() => handleChange("propertyType", prop.id)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span className="block text-sm mb-0.5">{prop.icon}</span>
                  {prop.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Roof Type */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {tx("roofType")}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "rcc", label: tx("rcc"), icon: "🏢" },
              { id: "metalSheet", label: tx("metalSheet"), icon: "🏭" },
              { id: "tiled", label: tx("tiled"), icon: "🏘️" },
            ].map((roof) => {
              const isSelected = (customerData.roofType || "rcc") === roof.id;
              return (
                <button
                  key={roof.id}
                  type="button"
                  onClick={() => handleChange("roofType", roof.id)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span className="block text-sm mb-0.5">{roof.icon}</span>
                  {roof.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional Notes */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            {tx("notes")} ({lang === "hi" ? "वैकल्पिक" : "Optional"})
          </label>
          <textarea
            rows={2}
            value={customerData.notes || ""}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder={tx("notesPlaceholder")}
            className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
          />
        </div>
      </div>

      {/* Save Notice */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span>💾</span>
          <span>{lang === "hi" ? "आगे बढ़ने पर कोटेशन और ग्राहक विवरण डेटाबेस में सेव होगा।" : "Your quotation and customer details will be saved to the database when you continue."}</span>
        </span>
        <span className="font-semibold text-emerald-600">{lang === "hi" ? "सुरक्षित सेव" : "Secure save"}</span>
      </div>

      {saveError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{saveError}</p>}

      {/* ─── Navigation Actions ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold transition-all text-xs"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>{tx("previous")}</span>
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 text-sm disabled:opacity-50"
        >
          <span>{isSaving ? "Saving..." : tx("generateQuotation")}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </form>
  );
}
