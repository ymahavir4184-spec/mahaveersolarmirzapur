"use client";

import React from "react";
import { quotationText } from "../../lib/quotation/quotationTranslations.js";

/**
 * =============================================================================
 * STEP 2: MATERIAL LIST COMPONENT (Software Light Theme)
 * =============================================================================
 * Clean software table for Bill of Materials (BoM).
 * Prominently displays:
 * - "PRICE NOT DISPLAYED — Material specification quotation only"
 * - Clear equipment specifications and quantities
 * =============================================================================
 */
export default function MaterialList({
  materials = [],
  capacityKw,
  systemType,
  panelWatt,
  onNext,
  onPrev,
  lang = "hi",
}) {
  const tx = (key) => quotationText[key]?.[lang] || quotationText[key]?.en || "";

  return (
    <div className="space-y-5">
      {/* Header Info */}
      <div className="border-b border-slate-200 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold mb-2">
          <span>📋</span>
          <span>Step 2 of 4 • {tx("step2Title")}</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {tx("step2Title")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {tx("step2Subtitle")}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 self-start sm:self-center">
            <span>⚡ {capacityKw} kW</span>
            <span>•</span>
            <span className="capitalize">{systemType}</span>
            <span>•</span>
            <span>{panelWatt}W</span>
          </div>
        </div>
      </div>

      {/* ─── Price-Free Notice Banner ─────────────────────────────────────── */}
      <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-2.5">
        <div className="text-amber-600 text-lg flex-shrink-0">
          🛡️
        </div>
        <div>
          <div className="text-xs font-bold text-amber-900">
            {tx("noPriceNote")}
          </div>
          <div className="text-[11px] text-amber-700 mt-0.5 leading-relaxed">
            {tx("illustrativeNote")}
          </div>
        </div>
      </div>

      {/* ─── Material List Table (Software UI) ────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
          <div className="col-span-1">#</div>
          <div className="col-span-4">{lang === "hi" ? "मटेरियल / उपकरण" : "Material / Equipment"}</div>
          <div className="col-span-4">{tx("specification")}</div>
          <div className="col-span-3 text-right">{tx("qty")}</div>
        </div>

        {/* Material Items */}
        <div className="divide-y divide-slate-100">
          {materials.map((item, idx) => {
            const itemName = lang === "hi" && item.nameHi ? item.nameHi : item.name;
            const itemSpec = lang === "hi" && item.specHi ? item.specHi : item.spec;
            const itemDetails = lang === "hi" && item.detailsHi ? item.detailsHi : item.details;

            return (
              <div
                key={item.id || idx}
                className="p-3.5 md:px-5 md:py-3 hover:bg-slate-50/70 transition-colors"
              >
                {/* Desktop Row */}
                <div className="hidden md:grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-1 text-xs font-bold text-slate-400">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <div className="col-span-4">
                    <div className="font-bold text-slate-900 text-xs">
                      {itemName}
                    </div>
                    {itemDetails && (
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {itemDetails}
                      </div>
                    )}
                  </div>
                  <div className="col-span-4 text-xs text-slate-600 font-medium">
                    {itemSpec}
                  </div>
                  <div className="col-span-3 text-right">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-bold text-xs border border-blue-100">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                </div>

                {/* Mobile Card */}
                <div className="md:hidden space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-400">
                        #{idx + 1}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900">
                        {itemName}
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[11px] border border-blue-100 whitespace-nowrap">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <div className="font-medium">{itemSpec}</div>
                  </div>
                </div>
              </div>
            );
          })}
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

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 text-sm"
        >
          <span>{tx("next")}: {tx("step3Title")}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}
