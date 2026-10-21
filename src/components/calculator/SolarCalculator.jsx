"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/lib/LanguageContext";
import { normalizeIndianPhone } from "@/lib/phone";
import Card from "../ui/Card";
import Button from "../ui/Button";
import {
  Zap,
  IndianRupee,
  Sun,
  Clock,
  Info,
  ExternalLink,
  ArrowRight,
  FileText,
  Download,
  Share2,
  CheckCircle2,
  User,
  Phone,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export default function SolarCalculator({ standalone = false }) {
  const { language, t } = useLanguage();
  const calcConfig = siteConfig.calculator;

  const [mode, setMode] = useState("bill"); // 'bill' | 'units'
  const [billValue, setBillValue] = useState(6500);
  const [unitsValue, setUnitsValue] = useState(750);
  const [propertyType, setPropertyType] = useState("residential");
  const [roofArea, setRoofArea] = useState("");

  // Client Details state
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientCity, setClientCity] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  const tariff = calcConfig.defaultTariffPerUnit || 8.5;
  const generationPerKwPerDay = calcConfig.generationPerKwPerDay || 4.2;
  const costPerKw = calcConfig.costPerKw || 55000;
  const monthlyGenPerKw = generationPerKwPerDay * 30; // ~126 units/month/kW

  // Calculate monthly units and bill based on active tab
  let calculatedMonthlyUnits = mode === "bill" ? Math.round(billValue / tariff) : unitsValue;
  if (calculatedMonthlyUnits <= 0) calculatedMonthlyUnits = 100;

  // System size required to offset consumption
  const recommendedKw = Math.max(1, Math.round((calculatedMonthlyUnits / monthlyGenPerKw) * 10) / 10);
  const panelsCount = Math.ceil((recommendedKw * 1000) / 550);
  const roofAreaSqFt = Math.round(recommendedKw * 90);

  // Roof space check
  let roofWarning = null;
  if (roofArea && parseFloat(roofArea) > 0) {
    const area = parseFloat(roofArea);
    const maxKwFromRoof = Math.max(1, Math.floor(area / 90));
    if (recommendedKw > maxKwFromRoof) {
      roofWarning =
        language === "hi"
          ? `आपकी छत का क्षेत्रफल (${area} वर्ग फुट) लगभग ${maxKwFromRoof} kW सोलर सिस्टम के लिए उपयुक्त है।`
          : `Your roof space (${area} sq. ft.) can comfortably accommodate up to ${maxKwFromRoof} kW.`;
    }
  }

  // Monthly generation & financial returns
  const estMonthlyGeneration = Math.round(recommendedKw * monthlyGenPerKw);
  const estAnnualSavings = Math.round(estMonthlyGeneration * 12 * tariff);
  const estSystemCost = Math.round(recommendedKw * costPerKw);

  // Subsidy calculation (PM Surya Ghar Muft Bijli Yojana)
  let subsidyAmount = 0;
  if (propertyType === "residential") {
    if (recommendedKw < 2) {
      subsidyAmount = 30000;
    } else if (recommendedKw < 3) {
      subsidyAmount = 60000;
    } else {
      subsidyAmount = 78000;
    }
  }
  const netCost = Math.max(0, estSystemCost - subsidyAmount);
  const estPaybackYears =
    netCost > 0 && estAnnualSavings > 0
      ? (netCost / estAnnualSavings).toFixed(1)
      : (estSystemCost / estAnnualSavings).toFixed(1);

  const co2SavingsTonnes = (recommendedKw * 1.2).toFixed(1);
  const treesEquivalent = Math.round(recommendedKw * 20);

  // Asynchronously record lead if phone is provided
  const saveLeadSilently = async (phoneToSave, nameToSave) => {
    if (!phoneToSave) return;
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameToSave || "Solar Calculator Lead",
          phone: phoneToSave,
          city: clientCity || undefined,
          category: propertyType === "residential" ? "Residential" : propertyType === "commercial" ? "Commercial" : "Industrial",
          monthlyBill: mode === "bill" ? billValue : Math.round(unitsValue * tariff),
          message: `Generated Proposal for ${recommendedKw} kW (${propertyType}). Estimated savings: Rs. ${estAnnualSavings}/yr`,
          consent: true,
          source: "calculator",
          language,
        }),
      });
    } catch {
      // Non-blocking silent catch
    }
  };

  // Helper to get PDF doc
  const buildPdfDoc = async () => {
    const { generateSolarQuotationPdf } = await import("@/lib/pdfGenerator");
    return generateSolarQuotationPdf({
      clientName: clientName.trim() || "Valued Customer",
      clientPhone: clientPhone.trim() || "Not specified",
      city: clientCity.trim() || "Laxmanpuram Colony, Bharuhana, Mirzapur",
      propertyType,
      billValue: mode === "bill" ? billValue : Math.round(unitsValue * tariff),
      unitsValue: calculatedMonthlyUnits,
      mode,
      recommendedKw,
      estMonthlyGeneration,
      estAnnualSavings,
      estPaybackYears,
      estSystemCost,
      subsidyAmount,
      netCost,
      panelsCount,
      roofAreaSqFt,
      co2SavingsTonnes,
      treesEquivalent,
    });
  };

  // Handle direct PDF Download
  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    setActionSuccess(null);
    setPhoneError("");

    try {
      const doc = await buildPdfDoc();
      const safeName = (clientName.trim() || "Customer").replace(/[^a-zA-Z0-9]/g, "_");
      const filename = `Mahaveer_Enterprises_Quotation_${safeName}_${recommendedKw}kW.pdf`;
      doc.save(filename);

      if (clientPhone.trim()) {
        const phoneCheck = normalizeIndianPhone(clientPhone);
        if (phoneCheck.isValid) {
          saveLeadSilently(phoneCheck.normalized, clientName.trim());
        }
      }

      setActionSuccess(
        language === "hi"
          ? `✓ आधिकारिक सोलर कोटेशन PDF (${filename}) डाउनलोड हो गया है!`
          : `✓ Official Solar Proposal PDF (${filename}) downloaded successfully!`
      );
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Handle WhatsApp Sharing (without paid API)
  const handleShareWhatsapp = async (target = "company") => {
    setIsGeneratingPdf(true);
    setActionSuccess(null);
    setPhoneError("");

    let targetPhone = siteConfig.company.whatsapp.replace(/\D/g, "");

    if (target === "client") {
      if (!clientPhone.trim()) {
        setPhoneError(
          language === "hi"
            ? "कृपया ग्राहक का मोबाइल नंबर दर्ज करें ताकि उन्हें भेजा जा सके।"
            : "Please enter client's 10-digit mobile number to send to their WhatsApp."
        );
        setIsGeneratingPdf(false);
        return;
      }
      const phoneCheck = normalizeIndianPhone(clientPhone);
      if (!phoneCheck.isValid) {
        setPhoneError(
          language === "hi"
            ? "कृपया 10 अंकों का वैध भारतीय मोबाइल नंबर दर्ज करें।"
            : "Please enter a valid 10-digit Indian mobile number."
        );
        setIsGeneratingPdf(false);
        return;
      }
      targetPhone = phoneCheck.normalized.replace(/\D/g, "");
    }

    try {
      // 1. Generate & download the PDF for the user
      const doc = await buildPdfDoc();
      const safeName = (clientName.trim() || "Customer").replace(/[^a-zA-Z0-9]/g, "_");
      const filename = `Mahaveer_Enterprises_Quotation_${safeName}_${recommendedKw}kW.pdf`;
      doc.save(filename);

      // Save lead silently
      if (clientPhone.trim()) {
        const phoneCheck = normalizeIndianPhone(clientPhone);
        if (phoneCheck.isValid) {
          saveLeadSilently(phoneCheck.normalized, clientName.trim());
        }
      }

      // 2. Prepare structured WhatsApp message
      const sectorLabel = propertyType.charAt(0).toUpperCase() + propertyType.slice(1);
      const messageLines = [
        `🌞 *${siteConfig.company.name.toUpperCase()} - SOLAR ESTIMATE & PROPOSAL*`,
        `─────────────────────────────`,
        `👤 *Client Name:* ${clientName.trim() || "Valued Property Owner"}`,
        `📱 *Mobile No:* ${clientPhone.trim() || "Not specified"}`,
        `🏠 *Property Sector:* ${sectorLabel} Rooftop`,
        `⚡ *Recommended Solar:* ${recommendedKw} kW On-Grid System`,
        `☀️ *PV Modules:* ~${panelsCount}x 550W Tier-1 Panels`,
        `📊 *Est. Monthly Generation:* ~${estMonthlyGeneration.toLocaleString("en-IN")} Units (kWh)`,
        `💰 *Est. Annual Savings:* ₹${estAnnualSavings.toLocaleString("en-IN")} / year`,
        propertyType === "residential"
          ? `🏛️ *Govt. Subsidy (PM Surya Ghar):* ₹${subsidyAmount.toLocaleString("en-IN")}`
          : `🏛️ *Tax Benefit:* 40% Accelerated Depreciation`,
        `💵 *Net Estimated Cost:* ₹${netCost.toLocaleString("en-IN")}`,
        `⏱️ *Payback Period:* ~${estPaybackYears} Years`,
        `─────────────────────────────`,
        `📎 *Detailed official PDF with company stamp & specifications has been downloaded to device.*`,
        `🏢 *Office:* ${siteConfig.company.address}`,
        `📞 *Helpline / WhatsApp:* ${siteConfig.company.displayPhone}`,
      ];

      const fullMessage = messageLines.join("\n");
      const encodedMsg = encodeURIComponent(fullMessage);

      // Mobile vs Desktop detection
      const isMobile = typeof window !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      
      let waUrl = `https://wa.me/${targetPhone}?text=${encodedMsg}`;
      if (isMobile) {
        waUrl = `whatsapp://send?phone=${targetPhone}&text=${encodedMsg}`;
      } else {
        waUrl = `https://web.whatsapp.com/send?phone=${targetPhone}&text=${encodedMsg}`;
      }

      // Open WhatsApp in new tab/app
      window.open(waUrl, "_blank", "noopener,noreferrer");

      setActionSuccess(
        language === "hi"
          ? "✓ PDF डाउनलोड हो गया है और व्हाट्सएप खुल गया है! कोटेशन भेजने के लिए सेंड दबाएं।"
          : "✓ PDF downloaded! WhatsApp is now open with your proposal summary. Simply hit send!"
      );
    } catch (err) {
      console.error("WhatsApp share error:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className={`w-full max-w-5xl mx-auto ${standalone ? "" : "my-4"}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form Controls & Client Information (7 cols) */}
        <Card className="lg:col-span-7 bg-white shadow-card border-brand-border/80">
          <div className="flex flex-col items-start gap-3 pb-4 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg sm:text-xl font-bold font-display text-brand-navy flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-primary" aria-hidden="true" />
              <span>{t.calculator.inputHeading}</span>
            </h3>

            {/* Mode Toggle */}
            <div className="inline-flex w-full rounded-lg bg-slate-100 p-1 text-xs font-semibold sm:w-auto">
              <button
                type="button"
                onClick={() => setMode("bill")}
                className={`flex-1 px-2 py-1.5 text-center leading-tight transition-all sm:flex-none sm:px-3 ${
                  mode === "bill"
                    ? "bg-white text-brand-primary shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {t.calculator.billTab}
              </button>
              <button
                type="button"
                onClick={() => setMode("units")}
                className={`flex-1 px-2 py-1.5 text-center leading-tight transition-all sm:flex-none sm:px-3 ${
                  mode === "units"
                    ? "bg-white text-brand-primary shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {t.calculator.unitsTab}
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            {/* Primary Input (Bill or Units) */}
            {mode === "bill" ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="bill-range" className="text-sm font-bold text-slate-800">
                    {t.calculator.billLabel}
                  </label>
                  <span className="text-base sm:text-lg font-extrabold text-brand-primary bg-blue-50 px-3 py-1 rounded-lg border border-blue-200/50">
                    ₹{billValue.toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  id="bill-range"
                  type="range"
                  min="1000"
                  max="50000"
                  step="500"
                  value={billValue}
                  onChange={(e) => setBillValue(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>₹1,000</span>
                  <span>₹25,000</span>
                  <span>₹50,000+</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="units-range" className="text-sm font-bold text-slate-800">
                    {t.calculator.unitsLabel}
                  </label>
                  <span className="text-base sm:text-lg font-extrabold text-brand-primary bg-blue-50 px-3 py-1 rounded-lg border border-blue-200/50">
                    {unitsValue.toLocaleString("en-IN")} {t.calculator.kwhUnit}
                  </span>
                </div>
                <input
                  id="units-range"
                  type="range"
                  min="100"
                  max="6000"
                  step="50"
                  value={unitsValue}
                  onChange={(e) => setUnitsValue(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                />
                <div className="flex justify-between text-xs text-slate-600 mt-1">
                  <span>100 Units</span>
                  <span>3,000 Units</span>
                  <span>6,000+ Units</span>
                </div>
              </div>
            )}

            {/* Property Type Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                {t.calculator.propertyTypeLabel}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "residential", label: t.forms.propertyType.residential.split("/")[0].trim() },
                  { id: "commercial", label: t.forms.propertyType.commercial.split("/")[0].trim() },
                  { id: "industrial", label: t.forms.propertyType.industrial.split("/")[0].trim() },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setPropertyType(type.id)}
                    className={`p-2.5 rounded-xl border text-xs sm:text-sm font-bold transition-all text-center min-h-[44px] ${
                      propertyType === type.id
                        ? "border-brand-primary bg-blue-50/50 text-brand-primary"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Roof Area Input */}
            <div>
              <label htmlFor="calc-roof" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {t.calculator.roofAreaLabel}
              </label>
              <input
                id="calc-roof"
                type="number"
                placeholder="e.g. 500"
                value={roofArea}
                onChange={(e) => setRoofArea(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              {roofWarning && (
                <p className="mt-2 text-xs text-amber-700 flex items-center gap-1.5 bg-amber-50 p-2.5 rounded-lg border border-amber-200/60">
                  <Info className="w-4 h-4 flex-shrink-0" />
                  <span>{roofWarning}</span>
                </p>
              )}
            </div>

            {/* Client Details Section (for PDF Quotation & WhatsApp) */}
            <div className="pt-4 border-t border-slate-200">
              <h4 className="text-sm font-bold text-brand-navy flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-brand-primary" />
                <span>{t.calculator.clientDetailsHeading}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Client Name */}
                <div>
                  <label htmlFor="client-name" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.calculator.clientNameLabel}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      id="client-name"
                      type="text"
                      placeholder={t.calculator.clientNamePlaceholder}
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                  </div>
                </div>

                {/* Client Mobile Number */}
                <div>
                  <label htmlFor="client-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.calculator.clientPhoneLabel} *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      id="client-phone"
                      type="tel"
                      placeholder={t.calculator.clientPhonePlaceholder}
                      value={clientPhone}
                      onChange={(e) => {
                        setClientPhone(e.target.value);
                        if (phoneError) setPhoneError("");
                      }}
                      className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border ${
                        phoneError ? "border-red-500 bg-red-50/30" : "border-slate-200"
                      } focus:outline-none focus:ring-2 focus:ring-brand-primary`}
                    />
                  </div>
                  {phoneError && <p className="text-xs text-red-600 mt-1">{phoneError}</p>}
                </div>
              </div>

              {/* City / Location (Optional) */}
              <div className="mt-3">
                <label htmlFor="client-city" className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.calculator.clientCityLabel}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  <input
                    id="client-city"
                    type="text"
                    placeholder={t.calculator.clientCityPlaceholder}
                    value={clientCity}
                    onChange={(e) => setClientCity(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Right Column: Calculated Results Card & WhatsApp / PDF Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Dark Navy Results Card */}
          <div
            className="rounded-3xl text-white shadow-2xl p-6 sm:p-7 border border-slate-800 relative overflow-hidden"
            style={{
              backgroundColor: "#0B192C",
              backgroundImage: "radial-gradient(ellipse at top right, rgba(0, 98, 255, 0.25) 0%, transparent 70%)",
            }}
          >
            {/* Top Label */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-sky-400">
                {t.calculator.resultsHeading}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Tier-1 Approved</span>
              </span>
            </div>

            {/* Recommended System Size (Big Display) */}
            <div className="pb-5 border-b border-slate-800/80">
              <span className="text-xs text-slate-300 block mb-1">
                {t.calculator.systemSize}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black tracking-tight font-display text-white">
                  {recommendedKw}
                </span>
                <span className="text-xl font-extrabold text-sky-400">
                  {t.calculator.kwUnit}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  ~{panelsCount} {t.calculator.panelsCountValue} • ~{roofAreaSqFt} sq. ft.
                </span>
              </p>
            </div>

            {/* Key Metrics Breakdown */}
            <div className="py-4 space-y-3.5 border-b border-slate-800/80 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-400" />
                  {t.calculator.monthlyGeneration}
                </span>
                <span className="text-sm font-bold text-white">
                  ~{estMonthlyGeneration.toLocaleString("en-IN")} kWh
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-emerald-400" />
                  {t.calculator.annualSavings}
                </span>
                <span className="text-sm font-extrabold text-emerald-400">
                  ₹{estAnnualSavings.toLocaleString("en-IN")} / yr
                </span>
              </div>

              {propertyType === "residential" ? (
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    {t.calculator.subsidyLabel}
                  </span>
                  <span className="text-sm font-extrabold text-sky-300">
                    ₹{subsidyAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    Tax Benefit
                  </span>
                  <span className="text-sm font-bold text-sky-300">
                    40% Depreciation
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-300" />
                  {t.calculator.paybackPeriod}
                </span>
                <span className="text-sm font-bold text-white">
                  ~{estPaybackYears} {t.calculator.yearsUnit}
                </span>
              </div>
            </div>

            {/* Action Buttons: PDF & WhatsApp */}
            <div className="pt-5 space-y-2.5">
              {/* WhatsApp Share Button */}
              <button
                type="button"
                onClick={() => handleShareWhatsapp("company")}
                disabled={isGeneratingPdf}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all text-sm min-h-[44px]"
              >
                <Share2 className="w-4 h-4" />
                <span>
                  {isGeneratingPdf
                    ? t.calculator.generatingPdf
                    : t.calculator.shareCompanyWhatsapp}
                </span>
              </button>

              {/* Send to Client WhatsApp button (if client phone is filled) */}
              {clientPhone.trim() && (
                <button
                  type="button"
                  onClick={() => handleShareWhatsapp("client")}
                  disabled={isGeneratingPdf}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-500/40 font-bold py-2.5 px-4 rounded-xl transition-all text-xs min-h-[40px]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t.calculator.shareClientWhatsapp} ({clientPhone.trim()})</span>
                </button>
              )}

              {/* Direct Download Official PDF Proposal */}
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-brand-navy font-bold py-2.5 px-4 rounded-xl shadow transition-all text-xs min-h-[44px]"
              >
                <Download className="w-4 h-4 text-brand-primary" />
                <span>{t.calculator.downloadPdfCta}</span>
              </button>

              {/* Link to Full Quote */}
              <Button
                href={`/quote?kw=${recommendedKw}&bill=${
                  mode === "bill" ? billValue : Math.round(unitsValue * tariff)
                }&type=${propertyType}&name=${encodeURIComponent(clientName)}&phone=${encodeURIComponent(clientPhone)}`}
                variant="outline"
                className="w-full justify-between !border-slate-700 !text-slate-200 hover:!bg-slate-800/80 !text-xs !py-2.5"
              >
                <span>{t.calculator.quoteCta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Action Success Toast / Feedback */}
          {actionSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 font-medium flex items-start gap-2 shadow-sm animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Official Subsidy Note */}
          {calcConfig.showSubsidyNote && (
            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/60 text-xs text-slate-700 leading-relaxed">
              <p className="font-semibold text-brand-navy flex items-start gap-1.5 mb-1.5">
                <Info className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                <span>{t.calculator.subsidyNote}</span>
              </p>
              <a
                href={calcConfig.officialSubsidyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary font-bold inline-flex items-center gap-1 hover:underline pt-1"
              >
                <span>{t.calculator.viewSubsidyPortal}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Neutral Disclaimer */}
          <p className="text-[11px] text-slate-600 leading-normal px-2">
            {t.calculator.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}
