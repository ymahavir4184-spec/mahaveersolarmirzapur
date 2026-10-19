"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/lib/LanguageContext";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { Zap, IndianRupee, Sun, Clock, Info, ExternalLink, ArrowRight } from "lucide-react";

export default function SolarCalculator({ standalone = false }) {
  const { language, t } = useLanguage();
  const calcConfig = siteConfig.calculator;

  const [mode, setMode] = useState("bill"); // 'bill' | 'units'
  const [billValue, setBillValue] = useState(6500);
  const [unitsValue, setUnitsValue] = useState(750);
  const [propertyType, setPropertyType] = useState("residential");
  const [roofArea, setRoofArea] = useState("");

  const tariff = calcConfig.defaultTariffPerUnit || 8.5;
  const generationPerKwPerDay = calcConfig.generationPerKwPerDay || 4.2;
  const costPerKw = calcConfig.costPerKw || 55000;
  const monthlyGenPerKw = generationPerKwPerDay * 30; // ~126 units/month/kW

  // Calculate monthly units and bill based on active tab
  let calculatedMonthlyUnits = mode === "bill" ? Math.round(billValue / tariff) : unitsValue;
  if (calculatedMonthlyUnits <= 0) calculatedMonthlyUnits = 100;

  // System size required to offset consumption
  let recommendedKw = Math.max(1, Math.round((calculatedMonthlyUnits / monthlyGenPerKw) * 10) / 10);

  // Roof space check (approx 90 sq ft per kW)
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
  const estPaybackYears =
    estAnnualSavings > 0
      ? (estSystemCost / estAnnualSavings).toFixed(1)
      : "3.5";

  return (
    <div className={`w-full max-w-5xl mx-auto ${standalone ? "" : "my-4"}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Form Controls (7 cols) */}
        <Card className="lg:col-span-7 bg-white shadow-card border-brand-border/80">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="text-lg sm:text-xl font-bold font-display text-brand-navy flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-primary" aria-hidden="true" />
              <span>{t.calculator.inputHeading}</span>
            </h3>

            {/* Mode Toggle */}
            <div className="inline-flex rounded-lg bg-slate-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMode("bill")}
                className={`px-3 py-1.5 rounded-md transition-all ${
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
                className={`px-3 py-1.5 rounded-md transition-all ${
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
          </div>
        </Card>

        {/* Right Column: Calculated Results Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="bg-brand-navy text-white shadow-xl border-slate-800 p-6 sm:p-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-secondary mb-4">
              {t.calculator.resultsHeading}
            </h4>

            {/* Main Hero Metric: Recommended kW */}
            <div className="pb-6 border-b border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">
                {t.calculator.systemSize}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight font-display text-white">
                  {recommendedKw}
                </span>
                <span className="text-lg font-bold text-brand-secondary">
                  {t.calculator.kwUnit}
                </span>
              </div>
            </div>

            {/* Metric Breakdown Grid */}
            <div className="py-5 space-y-4 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-400" />
                  {t.calculator.monthlyGeneration}
                </span>
                <span className="text-sm font-bold text-white">
                  ~{estMonthlyGeneration.toLocaleString("en-IN")} kWh
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4 text-emerald-400" />
                  {t.calculator.annualSavings}
                </span>
                <span className="text-sm font-extrabold text-emerald-400">
                  ₹{estAnnualSavings.toLocaleString("en-IN")} / yr
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sky-400" />
                  {t.calculator.paybackPeriod}
                </span>
                <span className="text-sm font-bold text-white">
                  ~{estPaybackYears} {t.calculator.yearsUnit}
                </span>
              </div>
            </div>

            {/* Direct CTA to Quote Page with preselected kW */}
            <div className="pt-6">
              <Button
                href={`/quote?kw=${recommendedKw}&bill=${mode === "bill" ? billValue : Math.round(unitsValue * tariff)}&type=${propertyType}`}
                variant="primary"
                className="w-full justify-between"
              >
                <span>{t.calculator.quoteCta}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* Official Subsidy Note (driven by siteConfig) */}
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
