"use client";

import Image from "next/image";

export default function BusinessProfileCard({ business, lang = "hi" }) {
  if (!business) return null;
  const hi = lang === "hi";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5" aria-labelledby="business-profile-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5">
          {business.logo ? (
            <Image src={business.logo} alt={`${business.name || "Business"} logo`} width={64} height={64} className="h-full w-full object-contain" />
          ) : (
            <span aria-hidden="true" className="text-lg font-black text-blue-700">{(business.name || "B").slice(0, 1).toUpperCase()}</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-700">{hi ? "बिज़नेस प्रोफ़ाइल" : "Business profile"}</p>
          <h2 id="business-profile-heading" className="mt-0.5 text-base font-black text-slate-900">{business.name}</h2>
          <p className="mt-1 text-xs leading-5 text-slate-600">{business.address}</p>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
            {business.phone && <span>{hi ? "फोन" : "Phone"}: {business.phone}</span>}
            {business.email && <span>{business.email}</span>}
          </div>
        </div>

        <div className={`rounded-xl border px-3.5 py-3 sm:min-w-56 ${business.gstEnabled && business.gstin ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-600">GSTIN</p>
          <p className="mt-1 break-all text-sm font-black tracking-wide text-slate-900">{business.gstin || (hi ? "सेट नहीं है" : "Not configured")}</p>
          <p className={`mt-1 text-[11px] font-semibold ${business.gstEnabled ? "text-emerald-800" : "text-amber-800"}`}>
            {business.gstEnabled
              ? (hi ? "GST दरें उपलब्ध हैं" : "GST rates available")
              : (hi ? "GST चालू करने के लिए COMPANY_GSTIN सेट करें" : "Set COMPANY_GSTIN to enable GST")}
          </p>
        </div>
      </div>
    </section>
  );
}
