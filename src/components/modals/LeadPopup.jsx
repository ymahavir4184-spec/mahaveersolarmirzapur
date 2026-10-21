"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/lib/LanguageContext";
import { normalizeIndianPhone } from "@/lib/phone";
import {
  X,
  CheckCircle2,
  MessageCircle,
  Phone,
  Loader2,
  Sparkles,
  MapPin,
  ArrowRight,
} from "lucide-react";

export default function LeadPopup() {
  const { language, t, isChosen } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle"); // 'idle' | 'whatsapp_opened' | 'error'
  const [submittedLead, setSubmittedLead] = useState(null);
  const [inFlight, setInFlight] = useState(false);
  const modalRef = useRef(null);
  const timerRef = useRef(null);

  // Dynamic Zod schema with active language validation
  const schema = z.object({
    name: z.string().min(2, t.validation.nameRequired),
    phone: z.string().refine((val) => normalizeIndianPhone(val).isValid, {
      message: t.validation.phoneInvalid,
    }),
    city: z.string().max(100).optional(),
    category: z.string().optional(),
    consent: z.literal(true, {
      errorMap: () => ({ message: t.validation.consentRequired }),
    }),
    website_hp: z.string().max(0).optional(), // Honeypot
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      city: "",
      category: siteConfig.leadPopup.categories[0] || "Residential Rooftop (1 kW - 10 kW)",
      consent: true,
      website_hp: "",
    },
  });

  // Display on every browser load / refresh after a brief, smooth delay (no sessionStorage blocking)
  useEffect(() => {
    if (!siteConfig.features.leadPopup || !isChosen) return;

    const delayMs = (siteConfig.leadPopup.delaySeconds || 1.5) * 1000;
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delayMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isChosen]);

  // Handle escape key
  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleDismiss();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);

  // Dismiss for the current page view (does NOT block next refresh)
  const handleDismiss = () => {
    setIsVisible(false);
  };

  // Helper to detect mobile vs laptop/desktop
  const getIsMobile = () => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent || "";
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
      (typeof window !== "undefined" && window.innerWidth < 768)
    );
  };

  // Trigger WhatsApp dispatch
  const launchWhatsApp = (payload) => {
    const rawWhatsApp = siteConfig.company.whatsapp.replace(/\D/g, "");
    const messageLines = [
      `☀️ *New Solar Rooftop Consultation Request*`,
      `─────────────────────────────`,
      `👤 *Customer Name:* ${payload.name}`,
      `📞 *Mobile Number:* +91 ${payload.phone}`,
      payload.city ? `📍 *Location / City:* ${payload.city}` : null,
      `⚡ *Requirement:* ${payload.category}`,
      `🏢 *Target Shop:* ${siteConfig.company.name}`,
      `🌐 *Source:* Website Consultation Popup`,
      `─────────────────────────────`,
      `Namaste Mahaveer Enterprises! Please share feasibility assessment and quotation for my property.`,
    ].filter(Boolean);

    const fullMessage = messageLines.join("\n");
    const encoded = encodeURIComponent(fullMessage);

    const isMobile = getIsMobile();

    // Mobile: opens native WhatsApp app directly; Desktop: opens WhatsApp Web in browser
    const mobileAppUrl = `whatsapp://send?phone=${rawWhatsApp}&text=${encoded}`;
    const mobileWebFallback = `https://api.whatsapp.com/send?phone=${rawWhatsApp}&text=${encoded}`;
    const desktopWebUrl = `https://web.whatsapp.com/send?phone=${rawWhatsApp}&text=${encoded}`;

    if (isMobile) {
      // In mobile Chrome / iOS, navigate directly to native app protocol
      window.location.href = mobileAppUrl;

      // Fallback in case native protocol isn't registered
      setTimeout(() => {
        if (!document.hidden) {
          window.location.href = mobileWebFallback;
        }
      }, 1200);
    } else {
      // In laptop / desktop browser, open WhatsApp Web in a new tab
      window.open(desktopWebUrl, "_blank", "noopener,noreferrer");
    }

    return {
      activeUrl: isMobile ? mobileAppUrl : desktopWebUrl,
      mobileAppUrl,
      desktopWebUrl,
      isMobile,
    };
  };

  const onSubmit = async (data) => {
    if (inFlight) return;
    setInFlight(true);

    const { normalized } = normalizeIndianPhone(data.phone);
    const payload = {
      name: data.name.trim(),
      phone: normalized,
      city: data.city ? data.city.trim() : "",
      category: data.category || "Residential Rooftop (1 kW - 10 kW)",
      consent: true,
      source: "popup",
      language,
      honeypot: data.website_hp,
    };

    // 1. Immediately launch WhatsApp (mobile app or desktop WhatsApp Web)
    const waDetails = launchWhatsApp(payload);

    setSubmittedLead({
      ...payload,
      ...waDetails,
    });
    setSubmitStatus("whatsapp_opened");

    // 2. Concurrently record lead in database in background (keepalive guarantees completion)
    try {
      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {
        // Silently catch background network error since WhatsApp already triggered
      });
    } catch {
      // Non-blocking
    } finally {
      setInFlight(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-3 sm:items-center sm:p-4 bg-brand-navy/60 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-popup-title"
      ref={modalRef}
    >
      <div className="relative w-full max-w-lg max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-3xl border border-slate-200/90 bg-white p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200 sm:max-h-[calc(100dvh-2rem)] sm:p-8">
        {/* Subtle Decorative Gradient Header Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-primary via-emerald-500 to-amber-400" />

        {/* Close (X) Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-brand-navy hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          aria-label={t.buttons.close}
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* STATE: WhatsApp Dispatched / Confirmation */}
        {submitStatus === "whatsapp_opened" && submittedLead && (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-pulse">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold font-display text-brand-navy">
                {t.popup.whatsappOpenedTitle}
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                {t.popup.whatsappOpenedDesc}
              </p>
            </div>

            {/* Shop Owner Summary Card */}
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-left space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-emerald-950 font-bold">
                <span>{siteConfig.company.name}</span>
                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-semibold">
                  Official WhatsApp
                </span>
              </div>
              <p className="text-emerald-800">
                <span className="font-semibold">Recipient:</span> {siteConfig.company.displayPhone}
              </p>
              <p className="text-emerald-700 text-[11px]">
                <span className="font-semibold">Details:</span> {submittedLead.name} (
                +91 {submittedLead.phone}) • {submittedLead.category}
              </p>
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2.5">
              <a
                href={submittedLead.activeUrl}
                target={submittedLead.isMobile ? "_self" : "_blank"}
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 p-3.5 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-sm transition-all duration-200 shadow-sm hover:shadow"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>{t.popup.reopenWhatsapp}</span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${siteConfig.company.phone}`}
                  className="inline-flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-slate-100 text-brand-navy font-semibold text-xs hover:bg-slate-200 transition-colors"
                >
                  <Phone className="w-4 h-4 text-brand-primary" />
                  <span>{t.buttons.callNow}</span>
                </a>

                <button
                  type="button"
                  onClick={handleDismiss}
                  className="inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
                >
                  <span>{t.popup.closeButton}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STATE: Active Form */}
        {submitStatus === "idle" && (
          <div>
            <div className="mb-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.popup.instantBadge}</span>
              </div>
              <h2
                id="lead-popup-title"
                className="text-xl sm:text-2xl font-extrabold text-brand-navy font-display tracking-tight leading-snug"
              >
                {t.popup.title}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.popup.subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              {/* Honeypot field (hidden from real users) */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                {...register("website_hp")}
              />

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.forms.name.label} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder={t.forms.name.placeholder}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/60 focus:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                    errors.name ? "border-red-400" : "border-slate-200"
                  }`}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Phone and City Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Indian Mobile Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.forms.phone.label} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="98765 43210"
                      maxLength={14}
                      className={`w-full pl-12 pr-3 py-2.5 text-sm rounded-xl border bg-slate-50/60 focus:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                        errors.phone ? "border-red-400" : "border-slate-200"
                      }`}
                      {...register("phone")}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                {/* City / Area */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.popup.cityLabel}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={t.popup.cityPlaceholder}
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary"
                      {...register("city")}
                    />
                  </div>
                </div>
              </div>

              {/* Solar Requirement Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.forms.category.label}
                </label>
                <select
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  {...register("category")}
                >
                  {siteConfig.leadPopup.categories.map((cat, i) => (
                    <option key={i} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Consent Checkbox */}
              <div className="pt-0.5">
                <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-slate-500 leading-snug">
                  <input
                    type="checkbox"
                    className="mt-0.5 rounded border-slate-300 text-brand-primary focus:ring-brand-primary w-4 h-4 cursor-pointer"
                    {...register("consent")}
                  />
                  <span>
                    {t.forms.consent.prefix}
                    <Link
                      href="/privacy"
                      target="_blank"
                      className="text-brand-primary underline hover:text-brand-primary-dark font-medium"
                    >
                      {t.forms.consent.privacyLink}
                    </Link>
                    {t.forms.consent.suffix}
                  </span>
                </label>
                {errors.consent && (
                  <p className="mt-1 text-xs text-red-600">{errors.consent.message}</p>
                )}
              </div>

              {/* Action Buttons: WhatsApp Submit + Proper Skip Button */}
              <div className="pt-2 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  {/* Primary WhatsApp Button (8 cols on desktop) */}
                  <button
                    type="submit"
                    disabled={inFlight}
                    className="sm:col-span-8 flex items-center justify-center gap-2 p-3.5 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20BD5A] hover:to-[#0e7468] text-white font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed min-h-[48px]"
                  >
                    {inFlight ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t.forms.submitButton.submitting}</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-5 h-5 fill-current" />
                        <span>{t.popup.submitWhatsapp}</span>
                      </>
                    )}
                  </button>

                  {/* Proper Skip Button (4 cols on desktop) */}
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="sm:col-span-4 flex items-center justify-center p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition-colors min-h-[48px]"
                  >
                    <span>{t.popup.skipButton}</span>
                  </button>
                </div>

                {/* Micro note explaining WhatsApp opening */}
                <p className="text-[11px] text-center text-slate-400">
                  📲 {language === "hi"
                    ? "क्लिक करने पर आपके फोन/लैपटॉप में सीधे व्हाट्सएप खुल जाएगा।"
                    : "Opens WhatsApp instantly with pre-filled details for shop owner."}
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
