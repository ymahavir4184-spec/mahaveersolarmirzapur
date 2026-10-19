"use client";

import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/lib/LanguageContext";
import Container from "../ui/Container";
import { Phone, Mail, MapPin, Clock, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const { language, t } = useLanguage();
  const currentYear = new Date().getFullYear();

  const businessHours =
    siteConfig.businessHours?.[language] || siteConfig.businessHours?.en || "";

  const disclaimer =
    siteConfig.footer?.disclaimer?.[language] || siteConfig.footer?.disclaimer?.en || "";

  return (
    <footer className="bg-brand-navy text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">
          {/* Col 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-block" aria-label={`${siteConfig.company.name} Home`}>
              <div className="relative w-48 h-10 bg-white/95 rounded-lg p-1.5 px-3">
                <Image
                  src={siteConfig.company.logo}
                  alt={siteConfig.company.name}
                  fill
                  className="object-contain object-left px-2"
                />
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {t.footer.aboutCompany}
            </p>

            {/* Business Hours */}
            {businessHours && (
              <div className="flex items-start gap-2.5 text-xs text-slate-400 pt-2">
                <Clock className="w-4 h-4 text-brand-secondary flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>{businessHours}</span>
              </div>
            )}
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-white font-bold text-sm tracking-wider uppercase font-display">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-brand-secondary transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-secondary transition-colors">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-brand-secondary transition-colors">
                  {t.nav.products}
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-brand-secondary transition-colors">
                  {t.nav.projects}
                </Link>
              </li>
              <li>
                <Link href="/solar-savings-calculator" className="hover:text-brand-secondary transition-colors">
                  {t.nav.calculator}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-secondary transition-colors">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Solar Solutions (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-white font-bold text-sm tracking-wider uppercase font-display">
              {t.footer.solarServices}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services/residential" className="hover:text-brand-secondary transition-colors">
                  {t.nav.residential}
                </Link>
              </li>
              <li>
                <Link href="/services/commercial" className="hover:text-brand-secondary transition-colors">
                  {t.nav.commercial}
                </Link>
              </li>
              <li>
                <Link href="/services/industrial" className="hover:text-brand-secondary transition-colors">
                  {t.nav.industrial}
                </Link>
              </li>
              <li>
                <Link href="/quote" className="hover:text-brand-secondary transition-colors inline-flex items-center gap-1 font-semibold text-brand-secondary">
                  <span>{t.nav.getQuote}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Address (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-white font-bold text-sm tracking-wider uppercase font-display">
              {t.footer.contactInfo}
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={`tel:${siteConfig.company.phone}`}
                  className="flex items-start gap-2.5 hover:text-brand-secondary transition-colors"
                >
                  <Phone className="w-4 h-4 text-brand-secondary flex-shrink-0 mt-1" aria-hidden="true" />
                  <span>{siteConfig.company.displayPhone || siteConfig.company.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.company.email}`}
                  className="flex items-start gap-2.5 hover:text-brand-secondary transition-colors"
                >
                  <Mail className="w-4 h-4 text-brand-secondary flex-shrink-0 mt-1" aria-hidden="true" />
                  <span className="break-all">{siteConfig.company.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.company.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 hover:text-brand-secondary transition-colors group"
                >
                  <MapPin className="w-4 h-4 text-brand-secondary flex-shrink-0 mt-1" aria-hidden="true" />
                  <span className="text-slate-300 group-hover:text-white leading-relaxed">
                    {siteConfig.company.address}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Note */}
        {disclaimer && (
          <div className="py-6 border-b border-slate-800/60 text-xs text-slate-400 leading-relaxed">
            <p>{disclaimer}</p>
          </div>
        )}

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {currentYear} {siteConfig.footer?.copyright || siteConfig.company.name}. {t.footer.allRightsReserved}
          </p>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              {t.footer.privacyPolicy}
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              {t.footer.termsConditions}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
