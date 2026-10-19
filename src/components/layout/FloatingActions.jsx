"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { siteConfig } from "@/config/site";
import { Phone, MessageCircle } from "lucide-react";

export default function FloatingActions() {
  const { language, t } = useLanguage();

  const rawPhone = siteConfig.company.whatsapp.replace(/\D/g, "");
  const defaultMessage =
    language === "hi"
      ? "नमस्ते, मैं अपनी छत के लिए रूफटॉप सोलर सिस्टम लगवाना चाहता/चाहती हूँ। कृपया मुझे जानकारी प्रदान करें।"
      : "Hello, I am interested in getting a solar rooftop installation quote for my property. Please share details.";

  const whatsappUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div
      className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 pointer-events-none"
      role="region"
      aria-label="Direct Contact Actions"
    >
      {/* Call Button */}
      <a
        href={`tel:${siteConfig.company.phone}`}
        className="pointer-events-auto flex items-center gap-2 bg-white text-brand-navy hover:text-brand-primary p-3 sm:px-4 sm:py-2.5 rounded-full shadow-lg border border-slate-200/80 hover:shadow-xl transition-all duration-200 active:scale-95 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
        aria-label={`${t.buttons.callNow}: ${siteConfig.company.displayPhone || siteConfig.company.phone}`}
      >
        <span className="w-8 h-8 rounded-full bg-blue-50 text-brand-primary flex items-center justify-center flex-shrink-0 group-hover:bg-brand-primary group-hover:text-white transition-colors">
          <Phone className="w-4 h-4" aria-hidden="true" />
        </span>
        <span className="hidden sm:inline text-xs font-bold tracking-wide">
          {t.buttons.callNow}
        </span>
      </a>

      {/* WhatsApp Floating Button */}
      {siteConfig.features.whatsappButton && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto flex items-center gap-2 bg-[#25D366] text-white hover:bg-[#20BD5A] p-3.5 sm:px-4 sm:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
          aria-label={t.buttons.openWhatsapp}
        >
          <MessageCircle className="w-5 h-5 flex-shrink-0 fill-current" aria-hidden="true" />
          <span className="hidden sm:inline text-xs font-bold tracking-wide">
            {t.buttons.openWhatsapp}
          </span>
        </a>
      )}
    </div>
  );
}
