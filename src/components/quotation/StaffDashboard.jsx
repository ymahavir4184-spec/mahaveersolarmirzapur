"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ArrowLeft, FileText, LogOut, ReceiptText, Search } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/lib/LanguageContext";
import EstimateDeletionLog from "@/components/billing/EstimateDeletionLog";

const QuotationWizard = dynamic(() => import("./QuotationWizard"));
const BillBuilder = dynamic(() => import("@/components/billing/BillBuilder"));
const BillRecords = dynamic(() => import("@/components/billing/BillRecords"));
const EstimateBuilder = dynamic(() => import("@/components/billing/EstimateBuilder"));
const EstimateRecords = dynamic(() => import("@/components/billing/EstimateRecords"));

const tools = [
  { id: "estimate", icon: FileText, title: { hi: "A4 Estimate बनाएँ", en: "Generate A4 Estimate" }, detail: { hi: "ग्राहक, प्रोडक्ट, मात्रा और GST दर्ज करके multi-page estimate बनाएँ।", en: "Enter customer, products, quantity and tax to create a paginated estimate." }, color: "amber" },
  { id: "estimateRecords", icon: Search, title: { hi: "Estimate Tracker", en: "Estimate Tracker" }, detail: { hi: "Estimate नंबर, ग्राहक और तारीख से खोजें; पुराने PDF फिर डाउनलोड करें।", en: "Search estimates by number, customer or date and download saved PDFs." }, color: "amber" },
  { id: "estimateDeleteReport", icon: FileText, title: { hi: "Estimate Delete Report", en: "Estimate Delete Report" }, detail: { hi: "Delete hue estimates ka receipt, amount, staff ID aur date/time dekhein.", en: "Review deleted estimate receipts, amounts, staff IDs and date/time." }, color: "slate" },
  { id: "bill", icon: ReceiptText, title: { hi: "Generate Bill", en: "Generate Bill" }, detail: { hi: "प्रोडक्ट जोड़ें, कीमत दर्ज करें और A4 टैक्स बिल सेव करें।", en: "Add products, enter prices and save an A4 invoice." }, color: "emerald" },
  { id: "records", icon: Search, title: { hi: "Bill Records & Reports", en: "Bill Records & Reports" }, detail: { hi: "बिल नंबर, ग्राहक, मोबाइल और तारीख से खोजें।", en: "Search bills by number, customer, mobile or date." }, color: "slate" },
];

export default function StaffDashboard({ onLogout }) {
  const [view, setView] = useState("home");
  const { language: lang, setLanguage } = useLanguage();
  const hi = lang === "hi";
  const back = () => setView("home");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  if (view === "quotation") return <QuotationWizard onBack={back} onLogout={onLogout} />;
  if (view === "estimate") return <EstimateBuilder lang={lang} onBack={back} />;
  if (view === "estimateRecords") return <EstimateRecords lang={lang} onBack={back} />;
  if (view === "estimateDeleteReport") return <EstimateDeletionLog lang={lang} onBack={back} />;
  if (view === "bill") return <BillBuilder lang={lang} onBack={back} />;
  if (view === "records") return <BillRecords lang={lang} onBack={back} />;

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-5 sm:px-6 sm:py-8">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex min-w-0 items-center gap-3">
          <Image src={siteConfig.company.logo} alt={siteConfig.company.legalName || siteConfig.company.name} width={56} height={56} className="h-14 w-14 shrink-0 object-contain" />
          <div className="min-w-0">
            <h1 className="truncate text-lg font-black text-slate-900 sm:text-xl">{siteConfig.company.legalName || siteConfig.company.name}</h1>
            <p className="text-xs text-slate-500">{hi ? "स्टाफ डैशबोर्ड" : "Staff dashboard"} · {hi ? "सुरक्षित सत्र" : "Secure session"}</p>
          </div>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <button type="button" onClick={() => setLanguage(lang === "hi" ? "en" : "hi")} className="min-h-10 rounded-lg border border-slate-300 px-3 text-xs font-bold text-slate-700">{hi ? "English" : "हिंदी"}</button>
          <button type="button" onClick={onLogout} className="ml-auto inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-xs font-bold text-slate-700 hover:border-red-200 hover:bg-red-50 hover:text-red-700 sm:ml-0"><LogOut className="h-4 w-4" />{hi ? "लॉग आउट" : "Log out"}</button>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <p className="text-xs font-bold uppercase tracking-wide text-blue-700">{hi ? "कार्य चुनें" : "Choose an action"}</p>
        <h2 className="mt-1 text-2xl font-black text-slate-900">{hi ? "कोटेशन और बिलिंग" : "Quotations & billing"}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{hi ? "कोटेशन और A4 एस्टिमेट बनाएँ, ग्राहक का बिल सेव करें, और तारीख या ग्राहक के अनुसार रिपोर्ट देखें।" : "Create solar quotations and A4 estimates, save customer bills, and review records by date or customer."}</p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label={hi ? "बिलिंग टूल" : "Billing tools"}>
        {tools.map(({ id, icon: Icon, title, detail, color }) => (
          <button key={id} type="button" onClick={() => setView(id)} className="group flex min-h-48 flex-col items-start rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${color === "blue" ? "bg-blue-50 text-blue-700" : color === "emerald" ? "bg-emerald-50 text-emerald-700" : color === "amber" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-700"}`}><Icon className="h-5 w-5" /></span>
            <span className="mt-4 text-base font-extrabold text-slate-900">{title[lang]}</span>
            <span className="mt-1 text-sm leading-5 text-slate-600">{detail[lang]}</span>
            <span className="mt-auto pt-4 text-sm font-bold text-blue-700">{hi ? "खोलें" : "Open"} →</span>
          </button>
        ))}
      </section>
      <footer className="flex items-center gap-2 text-xs text-slate-500"><ArrowLeft className="h-3.5 w-3.5" />{hi ? "30 मिनट तक activity न हो तो auto logout होगा; refresh या tab बंद करने पर दोबारा login करें।" : "Auto logout after 30 minutes of inactivity; refresh or close the tab to sign in again."}</footer>
    </main>
  );
}
