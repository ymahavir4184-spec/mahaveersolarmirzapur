"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageSwitcher({ className = "" }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language selection"
      className={`inline-flex items-center rounded-full bg-slate-100 p-0.5 border border-slate-200/80 ${className}`}
    >
      <span className="sr-only">Choose language</span>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-pressed={language === "en"}
        className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary min-h-[36px] min-w-[36px] flex items-center justify-center ${
          language === "en"
            ? "bg-white text-brand-primary shadow-sm"
            : "text-slate-600 hover:text-brand-navy"
        }`}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => setLanguage("hi")}
        aria-pressed={language === "hi"}
        className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary min-h-[36px] min-w-[36px] flex items-center justify-center ${
          language === "hi"
            ? "bg-white text-brand-primary shadow-sm"
            : "text-slate-600 hover:text-brand-navy"
        }`}
      >
        हिंदी
      </button>
    </div>
  );
}
