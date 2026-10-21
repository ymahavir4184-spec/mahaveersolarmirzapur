"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { quotationText } from "../../lib/quotation/quotationTranslations.js";
import { generateMaterialList, getSystemSummary } from "../../lib/quotation/materialCalculator.js";
import CapacitySelector from "./CapacitySelector.jsx";
import MaterialList from "./MaterialList.jsx";
import CustomerForm from "./CustomerForm.jsx";
import QuotationPreview from "./QuotationPreview.jsx";
import CustomerTracker from "./CustomerTracker.jsx";
import { siteConfig } from "../../config/site.js";
import { useLanguage } from "@/lib/LanguageContext";

/**
 * =============================================================================
 * QUOTATION & TRACKER DASHBOARD (Software Light Theme)
 * =============================================================================
 * Complete software interface with:
 * - Tab 1: New Quotation 4-Step Wizard
 * - Tab 2: Customer Tracker (CRM & Purchase Checkbox)
 * - Pure white background, universal clean software UI
 * =============================================================================
 */
export default function QuotationWizard({ onLogout, onBack }) {
  const { language: lang, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState("wizard"); // "wizard" | "tracker"
  const [step, setStep] = useState(1);
  const [savedQuotation, setSavedQuotation] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab, step]);

  // System Configuration State
  const [capacityKw, setCapacityKw] = useState(5);
  const [systemType, setSystemType] = useState("on-grid");
  const [panelWatt, setPanelWatt] = useState(550);

  // Customer Form State
  const [customerData, setCustomerData] = useState({
    name: "",
    mobile: "",
    address: "",
    propertyType: "residential",
    roofType: "rcc",
    notes: "",
  });

  const tx = (key) => quotationText[key]?.[lang] || quotationText[key]?.en || "";

  // Auto-calculate materials
  const materials = useMemo(() => {
    return generateMaterialList({
      capacityKw: Number(capacityKw) || 1,
      systemType,
      panelWatt: Number(panelWatt) || 550,
      roofType: customerData.roofType || "rcc",
    });
  }, [capacityKw, systemType, panelWatt, customerData.roofType]);

  const summary = useMemo(() => {
    return getSystemSummary({
      capacityKw: Number(capacityKw) || 1,
      systemType,
      panelWatt: Number(panelWatt) || 550,
    });
  }, [capacityKw, systemType, panelWatt]);

  const toggleLanguage = () => {
    setLanguage(lang === "hi" ? "en" : "hi");
  };

  const handleReset = () => {
    setStep(1);
    setSavedQuotation(null);
    setCapacityKw(5);
    setSystemType("on-grid");
    setPanelWatt(550);
    setCustomerData({
      name: "",
      mobile: "",
      address: "",
      propertyType: "residential",
      roofType: "rcc",
      notes: "",
    });
  };

  const steps = [
    { num: 1, title: tx("step1Title"), short: lang === "hi" ? "क्षमता" : "Capacity" },
    { num: 2, title: tx("step2Title"), short: lang === "hi" ? "मटेरियल" : "Materials" },
    { num: 3, title: tx("step3Title"), short: lang === "hi" ? "ग्राहक" : "Customer" },
    { num: 4, title: tx("step4Title"), short: lang === "hi" ? "कोटेशन" : "Quotation" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-6">
      {/* ─── Software Top Header ─────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3.5">
          <Link href="/" className="inline-block flex-shrink-0">
            <Image
              src="/client-assets/logo.png"
              alt="Mahaveer Enterprises"
              width={64}
              height={64}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900 tracking-tight">
                {siteConfig.company.name}
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                ERP Portal
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              📍 {siteConfig.company.address} • 📞 {siteConfig.company.displayPhone}
            </p>
          </div>
        </div>

        {/* Dashboard Tabs & Actions */}
        <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto justify-between md:justify-end">
          {/* Main Navigation Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab("wizard")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "wizard"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>📝</span>
              <span>{lang === "hi" ? "नया कोटेशन" : "New Quotation"}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("tracker")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "tracker"
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>👥</span>
              <span>{lang === "hi" ? "ग्राहक ट्रैकर (Records)" : "Customer Tracker"}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onBack && (
              <button type="button" onClick={onBack} className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50">
                <span aria-hidden="true">←</span>
                <span>{lang === "hi" ? "डैशबोर्ड" : "Dashboard"}</span>
              </button>
            )}
            {/* Language Switch */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <span>🌐</span>
              <span>{lang === "hi" ? "English" : "हिंदी"}</span>
            </button>

            {/* Logout */}
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-600 border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                title="Logout"
              >
                <span>🚪</span>
                <span>{tx("logout")}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── TAB 1: Quotation Wizard ──────────────────────────────────────── */}
      {activeTab === "wizard" && (
        <div className="space-y-5">
          {/* Step Stepper Header */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-3 sm:p-4">
            <div className="grid grid-cols-4 gap-2">
              {steps.map((s) => {
                const isCompleted = step > s.num;
                const isCurrent = step === s.num;

                return (
                  <button
                    key={s.num}
                    type="button"
                    disabled={!isCompleted && !isCurrent}
                    onClick={() => {
                      if (isCompleted) setStep(s.num);
                    }}
                    className={`flex items-center justify-center gap-2 py-2 px-2 sm:px-3 rounded-xl transition-all ${
                      isCurrent
                        ? "bg-blue-50 border border-blue-200 text-blue-700"
                        : isCompleted
                        ? "bg-emerald-50/60 text-emerald-800 hover:bg-emerald-50 cursor-pointer"
                        : "opacity-40 cursor-not-allowed text-slate-400"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isCurrent
                          ? "bg-blue-600 text-white shadow-sm"
                          : isCompleted
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {isCompleted ? "✓" : s.num}
                    </div>
                    <span className="text-xs font-bold truncate hidden sm:inline">
                      {s.short}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Wizard Step Content Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-8">
            {step === 1 && (
              <CapacitySelector
                capacityKw={capacityKw}
                setCapacityKw={setCapacityKw}
                systemType={systemType}
                setSystemType={setSystemType}
                panelWatt={panelWatt}
                setPanelWatt={setPanelWatt}
                onNext={() => setStep(2)}
                lang={lang}
              />
            )}

            {step === 2 && (
              <MaterialList
                materials={materials}
                capacityKw={capacityKw}
                systemType={systemType}
                panelWatt={panelWatt}
                onNext={() => setStep(3)}
                onPrev={() => setStep(1)}
                lang={lang}
              />
            )}

            {step === 3 && (
              <CustomerForm
                customerData={customerData}
                setCustomerData={setCustomerData}
                capacityKw={capacityKw}
                systemType={systemType}
                panelWatt={panelWatt}
                panelCount={summary.panelCount}
                existingQuotation={savedQuotation}
                onNext={(quotation) => {
                  setSavedQuotation(quotation);
                  setStep(4);
                }}
                onPrev={() => setStep(2)}
                lang={lang}
              />
            )}

            {step === 4 && (
              <QuotationPreview
                capacityKw={capacityKw}
                systemType={systemType}
                panelWatt={panelWatt}
                materials={materials}
                customerData={customerData}
                quotation={savedQuotation}
                onPrev={() => setStep(3)}
                onReset={handleReset}
                lang={lang}
              />
            )}
          </div>
        </div>
      )}

      {/* ─── TAB 2: Customer Tracker / CRM ────────────────────────────────── */}
      {activeTab === "tracker" && (
        <CustomerTracker
          onNewQuotation={() => {
            setActiveTab("wizard");
            setStep(1);
            setSavedQuotation(null);
          }}
          lang={lang}
        />
      )}
    </div>
  );
}
