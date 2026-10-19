"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/lib/LanguageContext";
import { Check } from "lucide-react";

export default function LanguageOverlay() {
  const { isChosen, setLanguage } = useLanguage();
  const firstButtonRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isChosen) {
      firstButtonRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isChosen]);

  // Trap focus within overlay if open
  useEffect(() => {
    if (isChosen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        const focusable = modalRef.current?.querySelectorAll("button");
        if (!focusable || focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isChosen]);

  if (isChosen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/80 backdrop-blur-sm transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lang-overlay-title"
      ref={modalRef}
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 sm:p-10 shadow-2xl border border-slate-200/80 text-center animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Logo */}
        <div className="relative w-44 h-10 mx-auto mb-6">
          <Image
            src={siteConfig.company.logo}
            alt={siteConfig.company.name}
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* Heading */}
        <h2
          id="lang-overlay-title"
          className="text-2xl sm:text-3xl font-extrabold text-brand-navy font-display"
        >
          Welcome to {siteConfig.company.name}
        </h2>

        <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
          Please select your preferred language
          <br />
          <span className="font-medium text-slate-800">कृपया अपनी पसंदीदा भाषा चुनें</span>
        </p>

        {/* Action Buttons */}
        <div className="mt-8 space-y-3.5">
          <button
            ref={firstButtonRef}
            type="button"
            onClick={() => setLanguage("en")}
            className="w-full flex items-center justify-between p-4 px-6 rounded-2xl border-2 border-brand-primary bg-blue-50/40 text-brand-primary font-bold text-base sm:text-lg hover:bg-brand-primary hover:text-white transition-all duration-200 shadow-sm hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary min-h-[56px] group"
          >
            <span>Continue in English</span>
            <Check className="w-5 h-5 text-brand-primary group-hover:text-white transition-colors" />
          </button>

          <button
            type="button"
            onClick={() => setLanguage("hi")}
            className="w-full flex items-center justify-between p-4 px-6 rounded-2xl border-2 border-slate-200 bg-white text-brand-navy font-bold text-base sm:text-lg hover:border-brand-primary hover:text-brand-primary hover:bg-blue-50/20 transition-all duration-200 shadow-sm hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary min-h-[56px] group"
          >
            <span>हिंदी में आगे बढ़ें</span>
            <Check className="w-5 h-5 opacity-0 group-hover:opacity-100 text-brand-primary transition-opacity" />
          </button>
        </div>

        <p className="mt-6 text-xs text-slate-400">
          You can change the language anytime from the top navigation bar.
        </p>
      </div>
    </div>
  );
}
