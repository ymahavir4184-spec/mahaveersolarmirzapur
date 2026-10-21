"use client";

import { siteConfig } from "@/config/site";
import { useLanguage } from "@/lib/LanguageContext";
import Container from "../ui/Container";
import SectionHeading from "../ui/SectionHeading";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { Phone, MessageCircle, MapPin, Mail, Clock } from "lucide-react";

export default function HomeContactSection() {
  const { language, t } = useLanguage();

  const rawPhone = siteConfig.company.whatsapp.replace(/\D/g, "");
  const whatsappHref = `https://wa.me/${rawPhone}?text=${encodeURIComponent(
    language === "hi"
      ? `नमस्ते ${siteConfig.company.name}, मैं रूफटॉप सोलर लगाने के बारे में परामर्श चाहता हूँ।`
      : `Hello ${siteConfig.company.name}, I would like to schedule a solar consultation for my property.`
  )}`;

  const businessHours =
    siteConfig.businessHours?.[language] || siteConfig.businessHours?.en || "";

  return (
    <section className="py-20 md:py-28 bg-white" id="contact-section">
      <Container>
        <SectionHeading
          badge={t.sections.contact.badge}
          title={t.sections.contact.title}
          subtitle={t.sections.contact.subtitle}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Instant Contact Cards (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <Card className="bg-brand-ice/60 border-blue-100 p-6 sm:p-8 space-y-6">
              <h3 className="text-xl font-bold font-display text-brand-navy">
                Direct Communication Channels
              </h3>

              <div className="space-y-4">
                {/* Phone */}
                <a
                  href={`tel:${siteConfig.company.phone}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white border border-blue-100 hover:border-brand-primary transition-all duration-200 group shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {t.sections.contact.phoneLabel}
                    </div>
                    <div className="text-base sm:text-lg font-bold text-brand-navy group-hover:text-brand-primary">
                      {siteConfig.company.displayPhone || siteConfig.company.phone}
                    </div>
                  </div>
                </a>

                {/* WhatsApp */}
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-white border border-emerald-100 hover:border-[#25D366] transition-all duration-200 group shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#25D366] flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white transition-colors flex-shrink-0">
                    <MessageCircle className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Instant WhatsApp Chat
                    </div>
                    <div className="text-base sm:text-lg font-bold text-brand-navy group-hover:text-[#25D366]">
                      Chat with Solar Engineer
                    </div>
                  </div>
                </a>

                {/* Email */}
                <a
                  href={`mailto:${siteConfig.company.email}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white border border-blue-100 hover:border-brand-primary transition-all duration-200 group shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {t.sections.contact.emailLabel}
                    </div>
                    <div className="text-sm sm:text-base font-bold text-brand-navy group-hover:text-brand-primary truncate">
                      {siteConfig.company.email}
                    </div>
                  </div>
                </a>
              </div>
            </Card>

            {/* Operating Hours Note */}
            {businessHours && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3 text-xs sm:text-sm text-slate-600">
                <Clock className="w-5 h-5 text-brand-primary flex-shrink-0" />
                <span>
                  <strong>{t.sections.contact.hoursLabel}:</strong> {businessHours}
                </span>
              </div>
            )}
          </div>

          {/* Right Column: Office Location & Map Card (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <Card className="bg-white border-brand-border/80 p-6 sm:p-8 h-full flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-primary flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold font-display text-brand-navy">
                  {t.sections.contact.addressLabel}
                </h3>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {siteConfig.company.address}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 space-y-4">
                <Button
                  href={siteConfig.company.mapsUrl}
                  external
                  variant="outline"
                  size="md"
                  className="w-full"
                >
                  <span>Open Location in Google Maps</span>
                </Button>

                <Button href="/contact" variant="primary" size="md" className="w-full">
                  <span>Open Full Contact Form</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}
