"use client";

import React, { useState } from "react";
import Image from "next/image";
import { quotationText } from "../../lib/quotation/quotationTranslations.js";
import { generateMaterialQuotationPdf } from "../../lib/quotation/quotationPdfGenerator.js";
import { getSystemSummary } from "../../lib/quotation/materialCalculator.js";
import { siteConfig } from "../../config/site.js";

/**
 * =============================================================================
 * STEP 4: QUOTATION PREVIEW & ACTIONS COMPONENT (Software Light Theme)
 * =============================================================================
 * Displays clean document preview, PDF download, and WhatsApp sharing.
 * =============================================================================
 */
export default function QuotationPreview({
  capacityKw,
  systemType,
  panelWatt,
  materials = [],
  customerData = {},
  quotation = null,
  onPrev,
  onReset,
  lang = "hi",
}) {
  const [whatsappMobile, setWhatsappMobile] = useState(customerData.mobile || "");
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const tx = (key) => quotationText[key]?.[lang] || quotationText[key]?.en || "";

  const summary = getSystemSummary({
    capacityKw: Number(capacityKw) || 1,
    systemType,
    panelWatt: Number(panelWatt) || 550,
  });

  const quotationRef = quotation?.quotationRef || "—";
  const savedDate = quotation?.createdAt ? new Date(quotation.createdAt) : new Date();
  const todayDate = (Number.isNaN(savedDate.getTime()) ? new Date() : savedDate).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    try {
      const doc = generateMaterialQuotationPdf({
        customerName: customerData.name || "Customer",
        customerMobile: customerData.mobile || "",
        customerAddress: customerData.address || "",
        quotationRef,
        quotationDate: quotation?.createdAt || "",
        propertyType: customerData.propertyType || "residential",
        roofType: customerData.roofType || "rcc",
        capacityKw: Number(capacityKw) || 1,
        systemType,
        materials,
        summary,
        notes: customerData.notes || "",
        lang,
      });

      const cleanName = (customerData.name || "Customer").replace(/[^a-zA-Z0-9]/g, "_");
      const filename = `Mahaveer_Enterprises_Quotation_${cleanName}_${capacityKw}kW.pdf`;
      doc.save(filename);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
      return true;
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Error generating PDF.");
      return false;
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSendWhatsApp = () => {
    const cleanMobile = (whatsappMobile || customerData.mobile || "").replace(/\D/g, "");

    if (!cleanMobile || cleanMobile.length < 10) {
      alert("Please enter a valid 10-digit WhatsApp number.");
      return;
    }

    handleDownloadPdf();

    const customerName = customerData.name || "ग्राहक";
    const systemTypeLabel =
      systemType === "on-grid" ? "ऑन-ग्रिड" : systemType === "hybrid" ? "हाइब्रिड" : "ऑफ-ग्रिड";

    const messageText =
      lang === "hi"
        ? `नमस्ते ${customerName} जी! ☀️\n\n*${siteConfig.company.legalName} (मिर्जापुर)* की ओर से आपके *${capacityKw} kW (${systemTypeLabel})* सोलर सिस्टम का कोटेशन तैयार है।\n\n📊 *सिस्टम सारांश:*\n• सोलर क्षमता: ${capacityKw} kW (${summary.dcCapacityKw} kWp)\n• सोलर पैनल: ${summary.panelCount} नग (${panelWatt}W)\n• छत का क्षेत्र: ~${summary.roofAreaSqFt} sq ft\n• स्थान: ${customerData.address || "मिर्जापुर"}\n\n📄 *कृपया संलग्न PDF कोटेशन देखें* जिसमें सम्पूर्ण मटेरियल स्पेसिफिकेशन दी गई है।\n\n📞 *${siteConfig.company.legalName}*\n📍 ${siteConfig.company.address}, उत्तर प्रदेश\n📱 संपर्क: ${siteConfig.company.displayPhone}`
        : `Hello ${customerName} ji! ☀️\n\nYour *${capacityKw} kW (${systemType})* Solar System Quotation from *${siteConfig.company.legalName} (Mirzapur)* is ready.\n\n📊 *System Summary:*\n• Solar Capacity: ${capacityKw} kW (${summary.dcCapacityKw} kWp)\n• Solar Panels: ${summary.panelCount} Nos (${panelWatt}W)\n• Roof Area: ~${summary.roofAreaSqFt} sq ft\n• Location: ${customerData.address || "Mirzapur"}\n\n📄 *Please find the attached PDF Quotation* for complete material specifications.\n\n📞 *${siteConfig.company.legalName}*\n📍 ${siteConfig.company.address}, Uttar Pradesh\n📱 Contact: ${siteConfig.company.displayPhone}`;

    const waUrl = `https://wa.me/91${cleanMobile.slice(-10)}?text=${encodeURIComponent(messageText)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="border-b border-slate-200 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold mb-2">
          <span>✨</span>
          <span>Step 4 of 4 • {tx("step4Title")}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {tx("step4Title")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {tx("step4Subtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs self-start sm:self-center transition-all"
          >
            <span>🔄</span>
            <span>{tx("newQuotation")}</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs font-bold">
          <span className="text-base">✅</span>
          <span>{tx("pdfGenerated")}</span>
        </div>
      )}

      {/* ─── Actions Cards (Light Theme) ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Download PDF */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 text-xl font-bold flex-shrink-0">
            📄
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-900">
              {tx("downloadPdf")} (A4 Format)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === "hi"
                ? "लोगो, स्टाम्प और सम्पूर्ण मटेरियल स्पेसिफिकेशन के साथ A4 PDF।"
                : "Branded A4 PDF with logo, digital stamp and complete BoM."}
            </p>
            <div className="mt-3">
              <button
                type="button"
                disabled={isGeneratingPdf}
                onClick={handleDownloadPdf}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95 disabled:opacity-50"
              >
                <span>📥</span>
                <span>{isGeneratingPdf ? "Generating..." : tx("downloadPdf")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Card 2: Send WhatsApp */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 text-xl font-bold flex-shrink-0">
            💬
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-900">
              {tx("sendWhatsApp")}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === "hi"
                ? "सीधे ग्राहक के WhatsApp पर चैट खोलें और PDF भेजें।"
                : "Opens WhatsApp chat directly with pre-filled message."}
            </p>
            <div className="mt-2.5 space-y-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={whatsappMobile}
                  onChange={(e) => setWhatsappMobile(e.target.value.replace(/\D/g, ""))}
                  placeholder={tx("whatsappMobilePlaceholder")}
                  className="w-full pl-11 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
              >
                <span>📲</span>
                <span>{tx("sendPdfWhatsApp")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Visual Document Preview (Light Theme) ───────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
        {/* Document Header */}
        <div className="border-b-2 border-amber-500 pb-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex-shrink-0">
              <Image
                src="/client-assets/logo.png"
                alt="Mahaveer Enterprises"
                width={64}
                height={64}
                className="h-12 w-auto object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-amber-600 uppercase tracking-tight">
                {siteConfig.company.legalName || siteConfig.company.name}
              </h1>
              <p className="text-xs font-medium text-slate-500">
                {siteConfig.company.tagline}
              </p>
              <div className="text-[11px] text-slate-400 mt-1 space-y-0.5">
                <div>📍 {siteConfig.company.address} • 📞 {siteConfig.company.phone}</div>
              </div>
            </div>
          </div>
          <div className="text-left sm:text-right bg-slate-50 p-3 rounded-xl border border-slate-200 self-stretch sm:self-auto text-xs">
            <div className="text-[10px] font-bold text-slate-400 uppercase">Ref No</div>
          <div className="font-mono font-bold text-slate-900">{quotationRef}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase mt-1">Date</div>
            <div className="font-medium text-slate-700">{todayDate}</div>
          </div>
        </div>

        {/* Title Bar */}
        <div className="text-center py-2 bg-amber-50 rounded-lg border border-amber-200">
          <div className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider">
            {tx("pdfTitle")}
          </div>
          <div className="text-[11px] font-bold text-red-600 mt-0.5">
            {tx("pdfSubtitle")}
          </div>
        </div>

        {/* Customer & System Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold uppercase text-[10px] text-slate-400 mb-1">
              {tx("pdfCustomerDetails")}
            </div>
            <div className="flex">
              <span className="w-20 font-semibold text-slate-500">Name:</span>
              <span className="font-bold text-slate-900">{customerData.name || "—"}</span>
            </div>
            <div className="flex">
              <span className="w-20 font-semibold text-slate-500">Mobile:</span>
              <span className="font-bold text-slate-900">+91 {customerData.mobile || "—"}</span>
            </div>
            <div className="flex">
              <span className="w-20 font-semibold text-slate-500">Address:</span>
              <span className="text-slate-700">{customerData.address || "—"}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold uppercase text-[10px] text-slate-400 mb-1">
              {tx("systemSummary")}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400">{tx("capacityLabel")}</div>
                <div className="font-bold text-blue-600">{capacityKw} kW</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400">{tx("systemType")}</div>
                <div className="font-bold capitalize text-slate-800">{systemType}</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400">{tx("totalPanels")}</div>
                <div className="font-bold text-slate-800">{summary.panelCount} ({panelWatt}W)</div>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400">{tx("roofAreaRequired")}</div>
                <div className="font-bold text-slate-800">~{summary.roofAreaSqFt} sq ft</div>
              </div>
            </div>
          </div>
        </div>

        {/* Material Table Preview */}
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            {tx("pdfMaterialList")}
          </div>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="py-2 px-3 text-left">#</th>
                  <th className="py-2 px-3 text-left">Material</th>
                  <th className="py-2 px-3 text-left">Specification</th>
                  <th className="py-2 px-3 text-right">Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {materials.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2 px-3 text-slate-400 font-bold">{idx + 1}</td>
                    <td className="py-2 px-3 font-semibold text-slate-900">
                      {lang === "hi" && m.nameHi ? m.nameHi : m.name}
                    </td>
                    <td className="py-2 px-3 text-slate-600">
                      {lang === "hi" && m.specHi ? m.specHi : m.spec}
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-blue-600 whitespace-nowrap">
                      {m.quantity} {m.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification & Stamp */}
        <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-slate-400 max-w-sm text-[11px] leading-relaxed">
            {tx("pdfDisclaimer")}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-full border-2 border-red-600 text-red-600 flex flex-col items-center justify-center p-1.5 text-center rotate-[-6deg] bg-red-50/40">
              <span className="text-[6px] font-black tracking-wider uppercase">MAHAVEER ENTERPRISES</span>
              <span className="text-[10px] my-0.5">☀️</span>
              <span className="text-[5px] font-bold uppercase">VERIFIED SPEC</span>
              <span className="text-[5px] font-medium">MIRZAPUR</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-slate-900 text-xs">Authorized Signatory</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{siteConfig.company.legalName || siteConfig.company.name}</div>
              <div className="text-[10px] text-slate-400">{siteConfig.company.address}</div>
            </div>
          </div>
        </div>
      </div>

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

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            <span>📥</span>
            <span>{tx("downloadPdf")}</span>
          </button>
          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            <span>📲</span>
            <span>{tx("sendWhatsApp")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
