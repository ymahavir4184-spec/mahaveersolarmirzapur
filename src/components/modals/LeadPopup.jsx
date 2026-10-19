"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/lib/LanguageContext";
import { normalizeIndianPhone } from "@/lib/phone";
import { X, CheckCircle2, AlertCircle, MessageCircle, Phone, ArrowRight, Loader2 } from "lucide-react";

const DISMISSED_SESSION_KEY = "aura_solar_lead_dismissed";
const SUBMITTED_STORAGE_KEY = "aura_solar_lead_submitted_at";

export default function LeadPopup() {
  const { language, t, isChosen } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle"); // 'idle' | 'success' | 'backend_unconfigured' | 'error'
  const [submittedLead, setSubmittedLead] = useState(null);
  const [inFlight, setInFlight] = useState(false);
  const modalRef = useRef(null);
  const timerRef = useRef(null);

  // Zod schema with active language validation messages
  const schema = z.object({
    name: z.string().min(2, t.validation.nameRequired),
    phone: z.string().refine((val) => normalizeIndianPhone(val).isValid, {
      message: t.validation.phoneInvalid,
    }),
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
      category: siteConfig.leadPopup.categories[0] || "",
      consent: false,
      website_hp: "",
    },
  });

  // Check display eligibility: language must be chosen first, not already dismissed or recently submitted
  useEffect(() => {
    if (!siteConfig.features.leadPopup || !isChosen) return;

    try {
      const isDismissed = sessionStorage.getItem(DISMISSED_SESSION_KEY) === "true";
      const submittedAt = localStorage.getItem(SUBMITTED_STORAGE_KEY);

      if (isDismissed) return;

      if (submittedAt) {
        const cooldownMs = (siteConfig.leadPopup.cooldownHours || 24) * 60 * 60 * 1000;
        const timeElapsed = Date.now() - parseInt(submittedAt, 10);
        if (timeElapsed < cooldownMs) return;
      }
    } catch {
      // Storage restricted, continue
    }

    // Trigger on timer or on first user scroll
    const triggerPopup = () => {
      setIsVisible(true);
      window.removeEventListener("scroll", handleFirstScroll);
      if (timerRef.current) clearTimeout(timerRef.current);
    };

    const handleFirstScroll = () => {
      if (window.scrollY > 120) {
        triggerPopup();
      }
    };

    const delayMs = (siteConfig.leadPopup.delaySeconds || 4) * 1000;
    timerRef.current = setTimeout(triggerPopup, delayMs);
    window.addEventListener("scroll", handleFirstScroll, { passive: true });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("scroll", handleFirstScroll);
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

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      sessionStorage.setItem(DISMISSED_SESSION_KEY, "true");
    } catch {
      // Ignore
    }
  };

  const onSubmit = async (data) => {
    if (inFlight) return; // In-flight double-submit guard
    setInFlight(true);

    const { normalized } = normalizeIndianPhone(data.phone);
    const payload = {
      name: data.name.trim(),
      phone: normalized,
      category: data.category || "General Solar Enquiry",
      consent: true,
      source: "popup",
      language,
      honeypot: data.website_hp,
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (response.status === 200 && result.ok) {
        setSubmitStatus("success");
        setSubmittedLead(payload);
        try {
          localStorage.setItem(SUBMITTED_STORAGE_KEY, Date.now().toString());
        } catch {
          // Ignore
        }
      } else if (response.status === 503 || result.code === "BACKEND_NOT_CONFIGURED") {
        // Backend not configured - honest fallback message
        setSubmitStatus("backend_unconfigured");
        setSubmittedLead(payload);
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("backend_unconfigured");
      setSubmittedLead(payload);
    } finally {
      setInFlight(false);
    }
  };

  if (!isVisible) return null;

  // Prefilled WhatsApp message
  const rawWhatsApp = siteConfig.company.whatsapp.replace(/\D/g, "");
  const whatsappText = submittedLead
    ? `New Solar Enquiry:\nName: ${submittedLead.name}\nPhone: ${submittedLead.phone}\nInterest: ${submittedLead.category}`
    : `Hello AuraSun Solar, I would like a rooftop feasibility report.`;

  const whatsappHref = `https://wa.me/${rawWhatsApp}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/60 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-popup-title"
      ref={modalRef}
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200/90 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-brand-navy hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          aria-label={t.buttons.close}
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* State 1: Success Confirmation */}
        {submitStatus === "success" && (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-brand-navy">
              {t.forms.feedback.successTitle}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
              {t.forms.feedback.successDesc}
            </p>

            {/* Direct WhatsApp Option */}
            <div className="pt-2 space-y-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 p-3.5 rounded-xl bg-[#25D366] text-white font-semibold hover:bg-[#20BD5A] transition-colors shadow-sm"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>{t.forms.feedback.whatsappCta}</span>
              </a>
              <p className="text-xs text-slate-400">
                {t.forms.feedback.whatsappNote}
              </p>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              className="mt-4 text-xs font-semibold text-slate-500 hover:text-brand-navy underline"
            >
              {t.buttons.close}
            </button>
          </div>
        )}

        {/* State 2: Honest Backend Not Configured Notice */}
        {submitStatus === "backend_unconfigured" && (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-display text-brand-navy">
              {t.forms.feedback.fallbackErrorTitle}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
              {t.forms.feedback.fallbackErrorDesc}
            </p>

            <div className="pt-2 space-y-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 p-3.5 rounded-xl bg-[#25D366] text-white font-semibold hover:bg-[#20BD5A] transition-colors"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>{t.buttons.openWhatsapp}</span>
              </a>

              <a
                href={`tel:${siteConfig.company.phone}`}
                className="w-full inline-flex items-center justify-center gap-2 p-3.5 rounded-xl bg-slate-100 text-brand-navy font-semibold hover:bg-slate-200 transition-colors"
              >
                <Phone className="w-4 h-4 text-brand-primary" />
                <span>{t.buttons.callNow}</span>
              </a>
            </div>

            <button
              type="button"
              onClick={handleDismiss}
              className="mt-4 text-xs font-semibold text-slate-500 hover:text-brand-navy underline"
            >
              {t.buttons.close}
            </button>
          </div>
        )}

        {/* State 3: Active Form */}
        {(submitStatus === "idle" || submitStatus === "error") && (
          <div>
            <div className="mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-primary bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/60">
                {t.popup.badge}
              </span>
              <h2
                id="lead-popup-title"
                className="mt-2.5 text-xl sm:text-2xl font-extrabold text-brand-navy font-display tracking-tight"
              >
                {t.popup.title}
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {t.popup.subtitle}
              </p>
            </div>

            {submitStatus === "error" && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                Submission failed. Please check your network or reach us directly on WhatsApp.
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
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
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                    errors.name ? "border-red-400" : "border-slate-200"
                  }`}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
                )}
              </div>

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
                    className={`w-full pl-12 pr-3.5 py-2.5 text-sm rounded-xl border bg-slate-50/50 focus:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                      errors.phone ? "border-red-400" : "border-slate-200"
                    }`}
                    {...register("phone")}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.forms.category.label}
                </label>
                <select
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
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
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 leading-snug">
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

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={inFlight}
                  className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl bg-brand-primary text-white font-bold text-sm hover:bg-brand-primary-dark transition-all duration-200 shadow-sm hover:shadow disabled:bg-slate-300 disabled:cursor-not-allowed min-h-[48px]"
                >
                  {inFlight ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t.forms.submitButton.submitting}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.forms.submitButton.popupSubmit}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Skip Link */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {t.popup.skip}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
