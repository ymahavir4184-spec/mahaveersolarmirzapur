"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/lib/LanguageContext";
import { normalizeIndianPhone } from "@/lib/phone";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { CheckCircle2, AlertCircle, MessageCircle, Phone, ArrowRight, Loader2 } from "lucide-react";

export default function LeadForm({
  source = "quote",
  defaultKw = "",
  defaultBill = "",
  defaultType = "residential",
}) {
  const { language, t } = useLanguage();
  const [submitStatus, setSubmitStatus] = useState("idle"); // 'idle' | 'success' | 'backend_unconfigured' | 'error'
  const [submittedLead, setSubmittedLead] = useState(null);
  const [inFlight, setInFlight] = useState(false);

  // Dynamic Zod schema with bilingual validation messages
  const schema = z.object({
    name: z.string().min(2, t.validation.nameRequired),
    phone: z.string().refine((val) => normalizeIndianPhone(val).isValid, {
      message: t.validation.phoneInvalid,
    }),
    email: z
      .string()
      .email(t.validation.emailInvalid)
      .optional()
      .or(z.literal("")),
    city: z.string().min(2, t.validation.cityRequired),
    propertyType: z.string().default("residential"),
    monthlyBill:
      source === "quote"
        ? z.string().min(1, t.validation.billRequired)
        : z.string().optional(),
    category: z.string().optional(),
    message: z.string().optional(),
    consent: z.literal(true, {
      errorMap: () => ({ message: t.validation.consentRequired }),
    }),
    website_hp: z.string().max(0).optional(), // Honeypot
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      city: "",
      propertyType: defaultType,
      monthlyBill: defaultBill,
      category: defaultKw ? `${defaultKw} kW Solar Sizing` : siteConfig.leadPopup.categories[0] || "",
      message: defaultKw ? `Interested in approximately ${defaultKw} kW rooftop solar system.` : "",
      consent: false,
      website_hp: "",
    },
  });

  const onSubmit = async (data) => {
    if (inFlight) return;
    setInFlight(true);

    const { normalized } = normalizeIndianPhone(data.phone);
    const payload = {
      name: data.name.trim(),
      phone: normalized,
      email: data.email?.trim() || "",
      city: data.city.trim(),
      category: data.category || "General Solar Enquiry",
      source,
      page_path: typeof window !== "undefined" ? window.location.pathname : `/${source}`,
      language,
      consent: true,
      monthly_bill: data.monthlyBill || "",
      message: data.message || "",
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
      } else if (response.status === 503 || result.code === "BACKEND_NOT_CONFIGURED") {
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

  // Prefilled WhatsApp message
  const rawWhatsApp = siteConfig.company.whatsapp.replace(/\D/g, "");
  const whatsappText = submittedLead
    ? `New Solar Quote Enquiry:\nName: ${submittedLead.name}\nPhone: ${submittedLead.phone}\nCity: ${submittedLead.city || "N/A"}\nMonthly Bill: ${submittedLead.monthly_bill || "N/A"}\nInterest: ${submittedLead.category}`
    : `Hello AuraSun Solar, I would like to request a customized rooftop solar quote.`;

  const whatsappHref = `https://wa.me/${rawWhatsApp}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <Card className="bg-white shadow-xl border-brand-border/80 p-6 sm:p-10 max-w-2xl mx-auto">
      {/* State 1: Success Confirmation */}
      {submitStatus === "success" && (
        <div className="text-center py-6 space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-brand-navy">
            {t.forms.feedback.successTitle}
          </h3>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            {t.forms.feedback.successDesc}
          </p>

          <div className="pt-4 space-y-3 max-w-md mx-auto">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 p-4 rounded-xl bg-[#25D366] text-white font-bold hover:bg-[#20BD5A] transition-colors shadow-sm"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>{t.forms.feedback.whatsappCta}</span>
            </a>
            <p className="text-xs text-slate-400">
              {t.forms.feedback.whatsappNote}
            </p>
          </div>
        </div>
      )}

      {/* State 2: Honest Notice if Backend Unconfigured */}
      {submitStatus === "backend_unconfigured" && (
        <div className="text-center py-6 space-y-5">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold font-display text-brand-navy">
            {t.forms.feedback.fallbackErrorTitle}
          </h3>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            {t.forms.feedback.fallbackErrorDesc}
          </p>

          <div className="pt-4 space-y-3 max-w-md mx-auto">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 p-4 rounded-xl bg-[#25D366] text-white font-bold hover:bg-[#20BD5A] transition-colors"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>{t.buttons.openWhatsapp}</span>
            </a>

            <a
              href={`tel:${siteConfig.company.phone}`}
              className="w-full inline-flex items-center justify-center gap-2 p-4 rounded-xl bg-slate-100 text-brand-navy font-bold hover:bg-slate-200 transition-colors"
            >
              <Phone className="w-4 h-4 text-brand-primary" />
              <span>{t.buttons.callNow}</span>
            </a>
          </div>
        </div>
      )}

      {/* State 3: Active Form */}
      {(submitStatus === "idle" || submitStatus === "error") && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {submitStatus === "error" && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              Submission could not be completed. Please reach out via WhatsApp or call us directly.
            </div>
          )}

          {/* Honeypot field (hidden) */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            {...register("website_hp")}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {t.forms.name.label} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder={t.forms.name.placeholder}
                className={`w-full px-4 py-3 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                  errors.name ? "border-red-400" : "border-slate-200"
                }`}
                {...register("name")}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {t.forms.phone.label} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                  +91
                </span>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  maxLength={14}
                  className={`w-full pl-14 pr-4 py-3 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                    errors.phone ? "border-red-400" : "border-slate-200"
                  }`}
                  {...register("phone")}
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email (Optional) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {t.forms.email.label}
              </label>
              <input
                type="email"
                placeholder={t.forms.email.placeholder}
                className={`w-full px-4 py-3 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                  errors.email ? "border-red-400" : "border-slate-200"
                }`}
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {t.forms.city.label} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder={t.forms.city.placeholder}
                className={`w-full px-4 py-3 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                  errors.city ? "border-red-400" : "border-slate-200"
                }`}
                {...register("city")}
              />
              {errors.city && (
                <p className="mt-1 text-xs text-red-600">{errors.city.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Property Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {t.forms.propertyType.label}
              </label>
              <select
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                {...register("propertyType")}
              >
                <option value="residential">{t.forms.propertyType.residential}</option>
                <option value="commercial">{t.forms.propertyType.commercial}</option>
                <option value="industrial">{t.forms.propertyType.industrial}</option>
                <option value="housingSociety">{t.forms.propertyType.housingSociety}</option>
              </select>
            </div>

            {/* Monthly Bill */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                {t.forms.monthlyBill.label} {source === "quote" && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                placeholder={t.forms.monthlyBill.placeholder}
                className={`w-full px-4 py-3 text-sm rounded-xl border bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                  errors.monthlyBill ? "border-red-400" : "border-slate-200"
                }`}
                {...register("monthlyBill")}
              />
              {errors.monthlyBill && (
                <p className="mt-1 text-xs text-red-600">{errors.monthlyBill.message}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              {t.forms.category.label}
            </label>
            <select
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
              {...register("category")}
            >
              {siteConfig.leadPopup.categories.map((cat, i) => (
                <option key={i} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              {t.forms.message.label}
            </label>
            <textarea
              rows={3}
              placeholder={t.forms.message.placeholder}
              className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
              {...register("message")}
            />
          </div>

          {/* Consent Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-3 cursor-pointer text-xs text-slate-600 leading-relaxed">
              <input
                type="checkbox"
                className="mt-1 rounded border-slate-300 text-brand-primary focus:ring-brand-primary w-4 h-4 cursor-pointer flex-shrink-0"
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
              <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.consent.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={inFlight}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-brand-primary text-white font-extrabold text-base hover:bg-brand-primary-dark transition-all duration-200 shadow-sm hover:shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed min-h-[52px]"
            >
              {inFlight ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t.forms.submitButton.submitting}</span>
                </>
              ) : (
                <>
                  <span>{t.forms.submitButton.default}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </Card>
  );
}
