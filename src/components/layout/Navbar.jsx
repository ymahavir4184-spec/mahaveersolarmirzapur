"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { useLanguage } from "@/lib/LanguageContext";
import Container from "../ui/Container";
import Button from "../ui/Button";
import LanguageSwitcher from "./LanguageSwitcher";
import { Menu, X, ChevronDown, Phone, ExternalLink } from "lucide-react";

export default function Navbar() {
  const { language, t } = useLanguage();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const drawerRef = useRef(null);
  const triggerRef = useRef(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  }, [pathname]);

  // Handle Escape key and focus trapping for mobile menu
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        triggerRef.current?.focus();
      }
    };

    // Lock body scroll
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    // Focus first link in drawer
    const firstFocusable = drawerRef.current?.querySelector("button, [href], input, select, textarea");
    firstFocusable?.focus();

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: t.nav.home, href: "/" },
    { label: t.nav.about, href: "/about" },
    {
      label: t.nav.services,
      href: "/services",
      isDropdown: true,
      subItems: [
        { label: t.nav.allServices, href: "/services" },
        { label: t.nav.residential, href: "/services/residential" },
        { label: t.nav.commercial, href: "/services/commercial" },
        { label: t.nav.industrial, href: "/services/industrial" },
      ],
    },
    { label: t.nav.products, href: "/products" },
    { label: t.nav.projects, href: "/projects" },
    { label: t.nav.calculator, href: "/solar-savings-calculator" },
    { label: t.nav.contact, href: "/contact" },
  ];

  const showLogin =
    siteConfig.features.loginButton &&
    Boolean(siteConfig.login?.url && siteConfig.login.url.trim().length > 0);

  const loginLabel =
    siteConfig.login?.label?.[language] || siteConfig.login?.label?.en || t.nav.clientPortal;

  return (
    <>
      {/* Skip to Content Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-primary focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
      >
        Skip to main content
      </a>

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3"
            : "bg-white border-b border-slate-100 py-4"
        }`}
      >
        <Container className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-lg"
            aria-label={`${siteConfig.company.name} Home`}
          >
            <div className="relative w-44 sm:w-48 h-10">
              <Image
                src={siteConfig.company.logo}
                alt={`${siteConfig.company.name} Logo`}
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-semibold text-slate-700"
          >
            {navLinks.map((item) => {
              if (item.isDropdown) {
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <Link
                      href={item.href}
                      className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg transition-colors hover:text-brand-primary hover:bg-slate-50 ${
                        pathname.startsWith("/services") ? "text-brand-primary font-bold bg-blue-50/50" : ""
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          servicesDropdownOpen ? "rotate-180 text-brand-primary" : "text-slate-400"
                        }`}
                        aria-hidden="true"
                      />
                    </Link>

                    {/* Services Dropdown */}
                    {servicesDropdownOpen && (
                      <div className="absolute top-full left-0 w-64 pt-2 z-50">
                        <div className="bg-white rounded-xl shadow-lg border border-slate-200/80 p-2 space-y-1">
                          {item.subItems.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                                pathname === sub.href
                                  ? "bg-blue-50 text-brand-primary font-bold"
                                  : "text-slate-700 hover:bg-slate-50 hover:text-brand-primary"
                              }`}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg transition-colors hover:text-brand-primary hover:bg-slate-50 ${
                    isActive ? "text-brand-primary font-bold bg-blue-50/50" : ""
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Switcher */}
            {siteConfig.features.languageSelection && <LanguageSwitcher />}

            {/* Optional Configurable Login Button */}
            {showLogin && (
              <a
                href={siteConfig.login.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-brand-primary rounded-lg transition-colors"
              >
                <span>{loginLabel}</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            )}

            {/* Free Quote CTA */}
            <Button href="/quote" variant="primary" size="sm">
              {t.nav.getQuote}
            </Button>
          </div>

          {/* Mobile Right Controls: Switcher + Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            {siteConfig.features.languageSelection && <LanguageSwitcher />}

            <button
              ref={triggerRef}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-drawer"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile Drawer Backdrop & Drawer Panel */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          id="mobile-drawer"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div
            ref={drawerRef}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl flex flex-col z-50 overflow-y-auto"
          >
            {/* Drawer Header */}
            <div className="p-5 flex items-center justify-between border-b border-slate-100">
              <div className="relative w-36 h-8">
                <Image
                  src={siteConfig.company.logo}
                  alt={siteConfig.company.name}
                  fill
                  className="object-contain object-left"
                />
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-brand-navy min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="p-5 flex-1 space-y-1">
              {navLinks.map((item) => {
                if (item.isDropdown) {
                  return (
                    <div key={item.href} className="py-2 border-b border-slate-100">
                      <div className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                        {item.label}
                      </div>
                      <div className="mt-1 space-y-1 pl-2">
                        {item.subItems.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={`block px-3 py-2.5 rounded-xl text-base font-semibold transition-colors min-h-[44px] flex items-center ${
                              pathname === sub.href
                                ? "bg-blue-50 text-brand-primary font-bold"
                                : "text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-3 rounded-xl text-base font-semibold transition-colors min-h-[44px] flex items-center ${
                      isActive
                        ? "bg-blue-50 text-brand-primary font-bold"
                        : "text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Login link in mobile if enabled */}
              {showLogin && (
                <a
                  href={siteConfig.login.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold text-slate-700 hover:bg-slate-50 min-h-[44px]"
                >
                  <span>{loginLabel}</span>
                  <ExternalLink className="w-4 h-4 text-slate-400" aria-hidden="true" />
                </a>
              )}
            </nav>

            {/* Mobile Drawer Footer CTA & Contact */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
              <Button href="/quote" variant="primary" className="w-full">
                {t.nav.getQuote}
              </Button>

              <a
                href={`tel:${siteConfig.company.phone}`}
                className="flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-slate-700 hover:text-brand-primary min-h-[44px]"
              >
                <Phone className="w-4 h-4 text-brand-primary" aria-hidden="true" />
                <span>{siteConfig.company.displayPhone || siteConfig.company.phone}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
