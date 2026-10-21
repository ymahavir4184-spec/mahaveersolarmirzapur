import { Outfit, Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { siteConfig } from "@/config/site";
import "@/config/validateConfig";
import { LanguageProvider } from "@/lib/LanguageContext";
import Navbar from "@/components/layout/Navbar";
import ScrollToTop from "@/components/layout/ScrollToTop";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import SiteAudio from "@/components/layout/SiteAudio";
import LanguageOverlay from "@/components/modals/LanguageOverlay";
import LeadPopup from "@/components/modals/LeadPopup";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || siteConfig.seo.baseUrl),
  title: {
    default: siteConfig.seo.title,
    template: `%s | ${siteConfig.company.name}`,
  },
  description: siteConfig.seo.description,
  keywords: siteConfig.seo.keywords,
  icons: {
    icon: siteConfig.company.favicon,
  },
  openGraph: {
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    url: siteConfig.seo.baseUrl,
    siteName: siteConfig.company.name,
    images: [
      {
        url: siteConfig.seo.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.company.name,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: [siteConfig.seo.ogImage],
  },
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  const initialLang = localeCookie || "en";
  const initialChosen = Boolean(localeCookie);

  const brandVariables = {
    "--brand-primary": siteConfig.branding.primary,
    "--brand-primary-dark": siteConfig.branding.primaryDark,
    "--brand-secondary": siteConfig.branding.secondary,
    "--brand-text": siteConfig.branding.text,
    "--brand-background": siteConfig.branding.background,
    "--brand-ice": siteConfig.branding.ice || "#F0F7FF",
    "--brand-navy": siteConfig.branding.navy || "#0B192C",
    "--brand-muted": siteConfig.branding.muted || "#64748B",
    "--brand-card": siteConfig.branding.card || "#FFFFFF",
    "--brand-border": siteConfig.branding.border || "#E2E8F0",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.company.name,
    description: siteConfig.seo.description,
    url: siteConfig.seo.baseUrl,
    logo: `${siteConfig.seo.baseUrl}${siteConfig.company.logo}`,
    image: `${siteConfig.seo.baseUrl}${siteConfig.assets.hero}`,
    telephone: siteConfig.company.phone,
    email: siteConfig.company.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.company.address,
      addressLocality: "Mirzapur",
      addressRegion: siteConfig.company.stateName,
      addressCountry: "IN",
    },
    legalName: siteConfig.company.legalName,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "19:00",
      },
    ],
    sameAs: Object.values(siteConfig.socialLinks).filter(Boolean),
  };

  return (
    <html
      lang={initialLang}
      className={`${outfit.variable} ${inter.variable}`}
      style={brandVariables}
    >
      <head>
        <meta name="description" content={siteConfig.seo.description} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-white text-slate-900">
        <LanguageProvider initialLanguage={initialLang} initialChosen={initialChosen}>
          <ScrollToTop />
          {/* First visit language selection overlay */}
          {siteConfig.features.languageSelection && <LanguageOverlay />}

          {/* Sticky Header */}
          <Navbar />

          {/* Accessible Main Content Area */}
          <main id="main-content" className="flex-1">
            {children}
          </main>

          {/* Global Lead Generation Popup */}
          <LeadPopup />

          {/* Floating Actions (WhatsApp + Phone) */}
          <FloatingActions />

          {/* Site intro audio: restarts on each full page load */}
          <SiteAudio />

          {/* Global Footer */}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
