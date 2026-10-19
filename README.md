# AuraSun Solar Website Platform

A production-ready, high-converting, reusable website platform engineered specifically for rooftop solar EPC companies, installers, and clean energy developers in India.

This codebase is architected as a **master template** for multiple solar clients. For each new client deployment, you only modify `src/config/site.js`, replace assets in `public/client-assets/`, and set production environment variables. No client-specific text, color, phone number, URL, or image path is hardcoded into the component layer.

---

## ⚡ Tech Stack & Pinned Dependencies

- **Framework**: [Next.js](https://nextjs.org/) (v15.5.28) with App Router & React 19
- **Language**: Pure JavaScript with `jsconfig.json` (`@/*` alias mapping to `src/*`)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v3.4.17) driven by dynamic CSS variables injected from `siteConfig`
- **Animations**: `motion` (v12.4.7, imported from `motion/react`) with automatic `prefers-reduced-motion` compliance
- **Icons**: [lucide-react](https://lucide-react.com/) (v0.475.0)
- **Forms & Validation**: `react-hook-form`, `zod`, `@hookform/resolvers`
- **Images**: `next/image` with custom `SmartImage` error fallback handling
- **Typography**: Display font (`Outfit`) and Body font (`Inter`) self-hosted via `next/font/google`
- **Lead Storage**: `@supabase/supabase-js` (server-side only via Service Role Key, never exposed to client)
- **Asset Generation**: `sharp` (devDependency for generating high-quality placeholder WebP visuals)

---

## 📁 Repository Directory Map

```text
├── .env.example                     # Environment variable blueprint
├── jsconfig.json                    # JS Path aliases (@/* -> src/*)
├── next.config.js                   # Security headers, image optimization rules
├── package.json                     # Pinned exact dependencies
├── postcss.config.mjs               # PostCSS Tailwind config
├── tailwind.config.js               # Tailwind design tokens tied to CSS variables
├── public/
│   └── client-assets/               # Client imagery, logo, favicon, WebP graphics
│       └── README.md                # Image specifications & guidelines
├── scripts/
│   ├── generate-placeholders.mjs    # Sharp script to regenerate placeholder WebP assets
│   └── check-links.mjs              # Automated internal link crawler
├── supabase/
│   └── schema.sql                   # Database table definition with RLS & indexes
├── docs/
│   ├── CLIENT_SETUP.md              # 9-step guide to onboarding a new solar client
│   ├── IMAGES.md                    # Asset resolutions, ratios, and formats
│   ├── DATABASE.md                  # Supabase schema, RLS, and lead handling
│   ├── DEPLOYMENT.md                # Vercel setup, domain mapping, and env keys
│   └── PRODUCTION_CHECKLIST.md      # Launch readiness and verification checklist
└── src/
    ├── app/
    │   ├── api/leads/route.js       # Lead capture endpoint with rate limiting & dedupe
    │   ├── about/page.js            # About company & milestones
    │   ├── contact/page.js          # Direct contact desk & location
    │   ├── privacy/page.js          # Config-driven privacy policy
    │   ├── products/page.js         # Tier-1 hardware catalog
    │   ├── projects/page.js         # Portfolio project gallery
    │   ├── projects/[slug]/page.js  # Dynamic static case study pages
    │   ├── quote/page.js            # Free solar quote feasibility form
    │   ├── services/page.js         # Services overview comparison
    │   ├── services/residential/    # Residential rooftop solar page
    │   ├── services/commercial/     # Commercial solar page
    │   ├── services/industrial/     # Industrial MW scale EPC page
    │   ├── solar-savings-calculator/# Interactive solar savings tool
    │   ├── terms/page.js            # Config-driven terms & conditions
    │   ├── error.js                 # Global runtime error boundary
    │   ├── globals.css              # Global styles & accessibility rules
    │   ├── layout.js                # Root layout with fonts, modals & JSON-LD
    │   ├── loading.js               # Route transition loading state
    │   ├── not-found.js             # Accessible 404 page
    │   ├── page.js                  # 14-section homepage
    │   ├── robots.js                # Dynamic robots.txt
    │   └── sitemap.js               # Dynamic XML sitemap
    ├── components/
    │   ├── calculator/              # SolarCalculator component
    │   ├── forms/                   # LeadForm component
    │   ├── home/                    # 13 dedicated homepage sections
    │   ├── layout/                  # Navbar, Footer, LanguageSwitcher, FloatingActions
    │   ├── modals/                  # LanguageOverlay, LeadPopup
    │   ├── ui/                      # Container, Section, Button, Card, Badge, Accordion, Breadcrumbs
    │   └── SmartImage.jsx           # Resilient next/image wrapper
    ├── config/
    │   ├── site.js                  # Master site configuration file
    │   └── validateConfig.js        # Build-time Zod schema validator
    └── lib/
        ├── LanguageContext.jsx      # Client state with cookie/localStorage sync
        ├── phone.js                 # Indian phone normalizer (+91XXXXXXXXXX)
        ├── rateLimit.js             # Upstash Redis & in-memory sliding rate limiter
        ├── supabaseServer.js        # Server-only Supabase client
        └── translations.js          # Complete English and Hindi dictionaries
```

---

## 🚀 Available NPM Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `dev` | `npm run dev` | Starts local Next.js development server at `http://localhost:3000` |
| `build` | `npm run build` | Builds the production bundle and validates static pages |
| `start` | `npm run start` | Runs the production build locally |
| `lint` | `npm run lint` | Runs ESLint static analysis across all files |
| `generate-placeholders` | `npm run generate-placeholders` | Regenerates all WebP assets in `public/client-assets/` using Sharp |
| `check-links` | `npm run check-links` | Scans all internal route links to prevent 404 dead links |

---

## 🌐 Bilingual Support (English & Hindi)

- **First Visit Experience**: A full-screen overlay presents visitors with a clear choice between English and Hindi.
- **Search Engine Friendly**: Crawlers can read underlying page markup without obstruction.
- **Persistence**: Language selection is saved simultaneously to a 1-year cookie (`NEXT_LOCALE`) and `localStorage`.
- **SSR Matching**: The server reads the cookie on incoming requests to render the correct language on first load, eliminating hydration flashes.
- **Switchable**: Users can toggle between English and Hindi at any time using the switcher in the header.
- **Cultural Accuracy**: Technical terms (`kW`, `kWh`, `MPPT`, `Tier-1`, brand names) remain untranslated for maximum clarity.

---

## 🔒 Security & Performance Features

- **Row Level Security (RLS)**: Client browsers cannot list or query leads from Supabase. All inserts are signed using the server-side `SUPABASE_SERVICE_ROLE_KEY`.
- **Honeypot Protection**: Hidden form fields silently discard spam bot submissions without disrupting user experience.
- **Rate Limiting**: Limits submissions per IP address (Upstash Redis when configured, in-memory fallback otherwise).
- **Lead Deduplication**: Automatically drops duplicate submissions with identical phone and source within 10 minutes.
- **Security Headers**: Injected automatically on all routes (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`).
- **No Third-Party Tracking**: Zero external analytics or ad scripts bundled, ensuring instant loading and AA privacy compliance.
