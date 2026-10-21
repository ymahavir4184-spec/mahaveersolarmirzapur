"use client";

import React, { useState, useEffect } from "react";
import { quotationText } from "../../lib/quotation/quotationTranslations.js";
import { getSystemSummary } from "../../lib/quotation/materialCalculator.js";

/**
 * =============================================================================
 * ALL INDUSTRY STANDARD SOLAR PANELS (From 330W to 700W)
 * =============================================================================
 */
export const ALL_PANEL_OPTIONS = [
  { watt: 330, type: "Polycrystalline", label: "330W — Polycrystalline (बजट पैनल)", desc: "Standard poly panel" },
  { watt: 400, type: "Mono PERC", label: "400W — Mono PERC (कॉम्पैक्ट)", desc: "Compact residential" },
  { watt: 440, type: "Mono Half-Cut", label: "440W — Mono PERC Half-Cut", desc: "Mid-range mono" },
  { watt: 450, type: "Mono Half-Cut", label: "450W — Mono PERC Half-Cut", desc: "High efficiency" },
  { watt: 500, type: "Mono PERC", label: "500W — Mono PERC High Output", desc: "High output" },
  { watt: 535, type: "Mono Half-Cut", label: "535W — Mono PERC Half-Cell", desc: "Standard commercial" },
  { watt: 540, type: "Mono Half-Cut", label: "540W — Mono PERC Half-Cut", desc: "Standard residential/commercial" },
  { watt: 545, type: "Mono PERC", label: "545W — Mono PERC Tier-1", desc: "Popular rooftop size" },
  { watt: 550, type: "Mono PERC", label: "550W — ⭐ Mono PERC (मानक / Most Popular)", desc: "Industry benchmark", isDefault: true },
  { watt: 575, type: "TOPCon Bi-facial", label: "575W — TOPCon Bi-facial (दोनों तरफ उत्पादन)", desc: "Dual-glass bi-facial" },
  { watt: 580, type: "TOPCon Bi-facial", label: "580W — N-Type TOPCon Bi-facial", desc: "High efficiency bi-facial" },
  { watt: 600, type: "TOPCon N-Type", label: "600W — N-Type TOPCon", desc: "High power generation" },
  { watt: 650, type: "Utility Grade", label: "650W — Commercial Utility Grade", desc: "Large commercial array" },
  { watt: 670, type: "Heavy Duty", label: "670W — Heavy Duty Commercial", desc: "Commercial plants" },
  { watt: 700, type: "Ultra High Power", label: "700W — Ultra High Power N-Type", desc: "Max density industrial" },
];

/**
 * =============================================================================
 * ALL SYSTEM CAPACITIES (0.5 kW to 100 kW)
 * =============================================================================
 */
export const ALL_CAPACITY_OPTIONS = [
  { kw: 0.5, label: "0.5 kW (500W - लघु सिस्टम)" },
  { kw: 1, label: "1 kW (1000W - 1-2 पंखे, लाइट)" },
  { kw: 1.5, label: "1.5 kW" },
  { kw: 2, label: "2 kW (छोटे घर के लिए)" },
  { kw: 2.5, label: "2.5 kW" },
  { kw: 3, label: "3 kW (⭐ PM सूर्य घर - सबसे लोकप्रिय)" },
  { kw: 4, label: "4 kW" },
  { kw: 5, label: "5 kW (मध्यम परिवार - 1 AC सहित)" },
  { kw: 6, label: "6 kW" },
  { kw: 7.5, label: "7.5 kW" },
  { kw: 8, label: "8 kW" },
  { kw: 10, label: "10 kW (बड़ा मकान / ऑफिस / 2-3 AC)" },
  { kw: 12, label: "12 kW" },
  { kw: 15, label: "15 kW (स्कूल / अस्पताल / दुकान)" },
  { kw: 20, label: "20 kW (होटल / शोरूम / कमर्शियल)" },
  { kw: 25, label: "25 kW" },
  { kw: 30, label: "30 kW" },
  { kw: 40, label: "40 kW" },
  { kw: 50, label: "50 kW (फैक्ट्री / कोल्ड स्टोरेज)" },
  { kw: 75, label: "75 kW" },
  { kw: 100, label: "100 kW (मेगा इंडस्ट्रियल प्लांट)" },
];

/**
 * =============================================================================
 * STEP 1: CAPACITY & PANEL SELECTOR WITH AUTO-SUGGEST
 * =============================================================================
 */
export default function CapacitySelector({
  capacityKw,
  setCapacityKw,
  systemType,
  setSystemType,
  panelWatt,
  setPanelWatt,
  onNext,
  lang = "hi",
}) {
  const [billInput, setBillInput] = useState("");
  const [suggestedKw, setSuggestedKw] = useState(null);
  const [suggestionApplied, setSuggestionApplied] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [customInput, setCustomInput] = useState("");

  const tx = (key) => quotationText[key]?.[lang] || quotationText[key]?.en || "";

  // Popular quick buttons
  const popularPresets = [1, 2, 3, 5, 10];

  // Calculate live summary
  const summary = getSystemSummary({
    capacityKw: Number(capacityKw) || 1,
    systemType,
    panelWatt: Number(panelWatt) || 550,
  });

  // Calculate system suggestion based on electricity bill
  useEffect(() => {
    const bill = parseFloat(billInput);
    if (!isNaN(bill) && bill > 0) {
      // Rule of thumb: ~₹1,000 bill = ~1 kW solar
      let kw = 1;
      if (bill <= 1500) kw = 1.5;
      else if (bill <= 2800) kw = 2;
      else if (bill <= 4200) kw = 3;
      else if (bill <= 5500) kw = 4;
      else if (bill <= 7000) kw = 5;
      else if (bill <= 9500) kw = 7.5;
      else if (bill <= 14000) kw = 10;
      else if (bill <= 22000) kw = 15;
      else if (bill <= 35000) kw = 25;
      else if (bill <= 70000) kw = 50;
      else kw = Math.min(100, Math.round(bill / 1000));

      setSuggestedKw(kw);
      setSuggestionApplied(false);
    } else {
      setSuggestedKw(null);
    }
  }, [billInput]);

  const applySuggestion = () => {
    if (suggestedKw) {
      setCapacityKw(suggestedKw);
      setIsCustom(false);
      setSuggestionApplied(true);
    }
  };

  const handlePresetSelect = (kw) => {
    setIsCustom(false);
    setCapacityKw(kw);
  };

  const handleDropdownCapacityChange = (e) => {
    const val = e.target.value;
    if (val === "custom") {
      setIsCustom(true);
      if (!customInput) setCustomInput("7.5");
      setCapacityKw(parseFloat(customInput) || 7.5);
    } else {
      setIsCustom(false);
      setCapacityKw(parseFloat(val));
    }
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setCapacityKw(num);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="border-b border-slate-200 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold mb-2">
          <span>⚡</span>
          <span>Step 1 of 4 • {tx("step1Title")}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {tx("step1Title")}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          {tx("step1Subtitle")}
        </p>
      </div>

      {/* ─── SMART SYSTEM AUTO-SUGGESTER (ऑटो सुझाव सिस्टम) ───────────────── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/80 to-amber-50/60 border border-blue-200/80 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <h3 className="font-bold text-sm text-slate-900">
            {lang === "hi"
              ? "स्मार्ट सिस्टम सुझाव (ग्राहक के बिल अनुसार ऑटो कैलकुलेटर)"
              : "Smart System Suggestion (Auto-calculate from bill)"}
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-600 text-white">
            Auto-Suggest
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-6 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
              ₹
            </span>
            <input
              type="number"
              value={billInput}
              onChange={(e) => setBillInput(e.target.value)}
              placeholder={
                lang === "hi"
                  ? "ग्राहक का मासिक बिजली बिल दर्ज करें (जैसे ₹4500)"
                  : "Enter customer's monthly electricity bill (e.g. 4500)"
              }
              className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-6">
            {suggestedKw ? (
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white p-2 px-3 rounded-xl border border-blue-300 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">
                      {lang === "hi" ? "सुझाई गई क्षमता" : "Recommended"}
                    </div>
                    <div className="text-base font-black text-blue-700">
                      {suggestedKw} kW
                    </div>
                  </div>
                  <span className="text-xs text-emerald-600 font-bold">~90% बिल बचत</span>
                </div>

                <button
                  type="button"
                  onClick={applySuggestion}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 whitespace-nowrap shadow-sm ${
                    suggestionApplied || capacityKw === suggestedKw
                      ? "bg-emerald-600 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white active:scale-95"
                  }`}
                >
                  <span>{suggestionApplied || capacityKw === suggestedKw ? "✓ लागू है" : "सुझाव लागू करें"}</span>
                </button>
              </div>
            ) : (
              <div className="text-xs text-slate-500 flex items-center gap-1.5 bg-white/70 p-2.5 rounded-xl border border-dashed border-slate-300">
                <span>💡</span>
                <span>
                  {lang === "hi"
                    ? "मासिक बिल दर्ज करते ही सिस्टम सही क्षमता ऑटोमैटिक सजेस्ट कर देगा।"
                    : "Enter bill amount to automatically suggest optimal solar kW."}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── 1. SOLAR CAPACITY SELECTION (Buttons + Full Dropdown) ─────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            {tx("capacityLabel")} ({lang === "hi" ? "सोलर क्षमता चुनें" : "Select Solar Capacity"})
          </label>
          <span className="text-xs font-bold text-blue-600">
            चयनित: {capacityKw} kW
          </span>
        </div>

        {/* Popular Quick Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {popularPresets.map((kw) => {
            const isSelected = !isCustom && capacityKw === kw;
            return (
              <button
                key={kw}
                type="button"
                onClick={() => handlePresetSelect(kw)}
                className={`py-3 px-2 rounded-xl border-2 font-black text-center transition-all ${
                  isSelected
                    ? "border-blue-600 bg-blue-600 text-white shadow-sm scale-[1.02]"
                    : "border-slate-200 hover:border-slate-300 bg-white text-slate-800"
                }`}
              >
                <div className="text-lg">{kw}</div>
                <div className={`text-[10px] uppercase tracking-wider ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                  kW {kw === 3 && "(PM Surya)"}
                </div>
              </button>
            );
          })}

          {/* Custom Toggle Button */}
          <button
            type="button"
            onClick={() => {
              setIsCustom(true);
              if (!customInput) setCustomInput(String(capacityKw));
            }}
            className={`py-3 px-2 rounded-xl border-2 font-black text-center transition-all ${
              isCustom
                ? "border-blue-600 bg-blue-600 text-white shadow-sm scale-[1.02]"
                : "border-slate-200 hover:border-slate-300 bg-white text-slate-800"
            }`}
          >
            <div className="text-base">✏️</div>
            <div className={`text-[10px] uppercase tracking-wider ${isCustom ? "text-blue-100" : "text-slate-400"}`}>
              {tx("customCapacity")}
            </div>
          </button>
        </div>

        {/* Comprehensive Capacity Dropdown (0.5 kW to 100 kW) */}
        <div className="pt-1">
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            {lang === "hi"
              ? "या ड्रॉपडाउन से पूरी रेंज (0.5 kW से 100 kW तक) में से चुनें:"
              : "Or choose from the full range (0.5 kW to 100 kW):"}
          </label>
          <div className="relative">
            <select
              value={isCustom ? "custom" : capacityKw}
              onChange={handleDropdownCapacityChange}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
            >
              <optgroup label="Residential & Commercial Capacities (0.5 kW - 100 kW)">
                {ALL_CAPACITY_OPTIONS.map((opt) => (
                  <option key={opt.kw} value={opt.kw}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>
              <option value="custom">✏️ कस्टम क्षमता दर्ज करें (Custom kW)</option>
            </select>
          </div>
        </div>

        {/* Custom Input (If custom selected) */}
        {isCustom && (
          <div className="pt-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {lang === "hi" ? "कस्टम किलोवाट दर्ज करें:" : "Enter custom kW capacity:"}
            </label>
            <div className="relative max-w-xs">
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="1000"
                value={customInput}
                onChange={handleCustomChange}
                placeholder="उदा. 7.5 या 12.5"
                className="w-full pl-3.5 pr-12 py-2 bg-white border-2 border-blue-500 rounded-lg text-slate-900 font-bold text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-blue-600">
                kW
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ─── 2. ALL TYPE PANEL WATTAGE DROPDOWN (330W to 700W) ────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            {tx("panelWattage")} ({lang === "hi" ? "सोलर पैनल वॉटेज व प्रकार" : "Panel Wattage & Type"})
          </label>
          <span className="text-xs font-bold text-blue-600">
            चयनित: {panelWatt}W
          </span>
        </div>

        {/* Quick Buttons for the 4 Most Common */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[540, 545, 550, 580].map((watt) => {
            const isSelected = panelWatt === watt;
            return (
              <button
                key={watt}
                type="button"
                onClick={() => setPanelWatt(watt)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                  isSelected
                    ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                {watt}W {watt === 550 && "⭐ (मानक)"}
              </button>
            );
          })}
        </div>

        {/* Full Range Dropdown for All Panel Wattages (330W - 700W) */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 mb-1">
            {lang === "hi"
              ? "या मार्केट के सभी पैनल (330W पॉलीक्रिस्टलाइन से 700W N-Type तक) ड्रॉपडाउन से चुनें:"
              : "Or select from all market panel types (330W to 700W):"}
          </label>
          <div className="relative">
            <select
              value={panelWatt}
              onChange={(e) => setPanelWatt(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
            >
              <optgroup label="Standard Rooftop Panels (330W - 550W)">
                {ALL_PANEL_OPTIONS.filter((p) => p.watt <= 550).map((p) => (
                  <option key={p.watt} value={p.watt}>
                    {p.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="High Efficiency & Bi-facial Panels (575W - 700W)">
                {ALL_PANEL_OPTIONS.filter((p) => p.watt > 550).map((p) => (
                  <option key={p.watt} value={p.watt}>
                    {p.label}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* ─── 3. SYSTEM TYPE SELECTOR (On-Grid / Hybrid / Off-Grid) ─────────── */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {tx("systemType")} ({lang === "hi" ? "सिस्टम प्रकार" : "System Configuration"})
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: "on-grid",
              label: tx("onGrid"),
              desc: tx("onGridDesc"),
              icon: "⚡",
              badge: lang === "hi" ? "सर्वाधिक लोकप्रिय" : "Popular",
            },
            {
              id: "hybrid",
              label: tx("hybrid"),
              desc: tx("hybridDesc"),
              icon: "🔋",
              badge: lang === "hi" ? "ग्रिड + बैटरी" : "Grid + Battery",
            },
            {
              id: "off-grid",
              label: tx("offGrid"),
              desc: tx("offGridDesc"),
              icon: "☀️",
              badge: lang === "hi" ? "स्टैंडअलोन" : "Standalone",
            },
          ].map((type) => {
            const isSelected = systemType === type.id;
            return (
              <div
                key={type.id}
                onClick={() => setSystemType(type.id)}
                className={`cursor-pointer rounded-xl p-3.5 border-2 transition-all relative ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/60 shadow-sm ring-1 ring-blue-600/30"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                {type.badge && (
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {type.badge}
                  </span>
                )}
                <div className="text-xl mb-1">{type.icon}</div>
                <h3 className="font-bold text-sm text-slate-900">{type.label}</h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {type.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── 4. LIVE SYSTEM CALCULATION SUMMARY (Software Card) ────────────── */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span>📊</span>
            <span>{lang === "hi" ? "सिस्टम गणना सारांश" : "Calculation Summary"}</span>
          </span>
          <span className="text-blue-700 font-bold">
            {capacityKw} kW • {panelWatt}W
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="text-[11px] text-slate-500">{tx("totalPanels")}</div>
            <div className="text-lg font-black text-blue-600 mt-0.5">
              {summary.panelCount}{" "}
              <span className="text-xs font-normal text-slate-500">
                ({panelWatt}W)
              </span>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="text-[11px] text-slate-500">{tx("dcCapacity")}</div>
            <div className="text-lg font-black text-slate-900 mt-0.5">
              {summary.dcCapacityKw}{" "}
              <span className="text-xs font-normal text-slate-500">kWp</span>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="text-[11px] text-slate-500">{tx("roofAreaRequired")}</div>
            <div className="text-lg font-black text-slate-900 mt-0.5">
              ~{summary.roofAreaSqFt}{" "}
              <span className="text-xs font-normal text-slate-500">sq ft</span>
            </div>
          </div>
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="text-[11px] text-slate-500">
              {lang === "hi" ? "अनुमानित उत्पादन" : "Est. Units"}
            </div>
            <div className="text-lg font-black text-emerald-600 mt-0.5">
              {summary.estimatedUnitsDaily}{" "}
              <span className="text-xs font-normal text-slate-500">units/day</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Navigation Actions ───────────────────────────────────────────── */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 text-sm"
        >
          <span>{tx("next")}: {tx("step2Title")}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
