import { z } from "zod";
import { siteConfig } from "./site.js";

const bilingualString = z.object({
  en: z.string().min(1, "English translation required"),
  hi: z.string().min(1, "Hindi translation required"),
});

const siteConfigSchema = z.object({
  company: z.object({
    name: z.string().min(1, "Company name is required"),
    tagline: bilingualString,
    logo: z.string().min(1, "Logo path is required"),
    favicon: z.string().min(1, "Favicon path is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    displayPhone: z.string().min(10),
    whatsapp: z.string().min(10, "WhatsApp number with country code is required"),
    email: z.string().email("Valid company email is required"),
    address: z.string().min(5, "Physical business address is required"),
    mapsUrl: z.string().url("Valid Google Maps URL is required"),
    establishedYear: z.number().int().min(1900).max(2100).optional(),
  }),

  branding: z.object({
    primary: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Invalid primary hex color"),
    primaryDark: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Invalid primaryDark hex color"),
    secondary: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Invalid secondary hex color"),
    text: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Invalid text hex color"),
    background: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Invalid background hex color"),
    ice: z.string().optional(),
    navy: z.string().optional(),
    muted: z.string().optional(),
    card: z.string().optional(),
    border: z.string().optional(),
  }),

  assets: z.record(z.string()),

  socialLinks: z.object({
    facebook: z.string().optional(),
    linkedin: z.string().optional(),
    instagram: z.string().optional(),
    youtube: z.string().optional(),
    twitter: z.string().optional(),
  }),

  services: z.record(
    z.object({
      slug: z.string().min(1),
      title: bilingualString,
      summary: bilingualString,
      benefits: z.object({
        en: z.array(z.string().min(1)),
        hi: z.array(z.string().min(1)),
      }),
      process: z.object({
        en: z.array(z.string().min(1)),
        hi: z.array(z.string().min(1)),
      }),
      image: z.string().min(1),
    })
  ),

  productCategories: z.array(
    z.object({
      id: z.string().min(1),
      name: bilingualString,
      description: bilingualString,
      specs: z.array(z.string()),
      image: z.string().min(1),
    })
  ),

  projects: z.array(
    z.object({
      slug: z.string().min(1),
      title: bilingualString,
      location: bilingualString,
      capacityKw: z.number().positive(),
      type: z.string().min(1),
      image: z.string().min(1),
      summary: bilingualString,
      details: bilingualString,
    })
  ),

  testimonials: z.array(z.any()),

  businessHours: bilingualString,

  trustStats: z.object({
    isPlaceholder: z.boolean(),
    stats: z.array(
      z.object({
        value: z.string().min(1),
        label: bilingualString,
      })
    ),
  }),

  faqs: z.array(
    z.object({
      question: bilingualString,
      answer: bilingualString,
    })
  ),

  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    baseUrl: z.string().url(),
    ogImage: z.string().min(1),
    keywords: z.array(z.string()),
  }),

  features: z.object({
    languageSelection: z.boolean(),
    leadPopup: z.boolean(),
    whatsappButton: z.boolean(),
    loginButton: z.boolean(),
    savingsCalculator: z.boolean(),
    testimonials: z.boolean(),
    projects: z.boolean(),
    showPlaceholders: z.boolean(),
  }),

  login: z.object({
    url: z.string(),
    label: bilingualString,
  }),

  leadPopup: z.object({
    delaySeconds: z.number().min(1),
    categories: z.array(z.string()),
    cooldownHours: z.number().min(1),
  }),

  calculator: z.object({
    defaultTariffPerUnit: z.number().positive(),
    costPerKw: z.number().positive(),
    generationPerKwPerDay: z.number().positive(),
    showSubsidyNote: z.boolean(),
    officialSubsidyUrl: z.string().url(),
  }),

  footer: z.object({
    copyright: z.string().min(1),
    licenseNote: z.string().optional(),
    disclaimer: bilingualString,
  }),
});

/**
 * Validates the siteConfig against the schema.
 * Throws a formatted Error if validation fails.
 */
export function validateConfig(config = siteConfig) {
  const result = siteConfigSchema.safeParse(config);
  if (!result.success) {
    const errorDetails = result.error.issues
      .map((issue) => `  - [${issue.path.join(".")}] ${issue.message}`)
      .join("\n");
    console.error("\n❌ BUILD FAILED: Invalid site configuration in src/config/site.js:\n");
    console.error(errorDetails);
    console.error("\nPlease correct these errors in src/config/site.js before proceeding.\n");
    throw new Error(`Invalid siteConfig in src/config/site.js:\n${errorDetails}`);
  }
  return result.data;
}

// Automatically validate when imported or executed
try {
  validateConfig(siteConfig);
} catch (err) {
  // If running directly as a node script, exit with error code
  if (typeof process !== "undefined" && process.exit && import.meta.url === `file://${process.argv[1]}`) {
    process.exit(1);
  }
}
