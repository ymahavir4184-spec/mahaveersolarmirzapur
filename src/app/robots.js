import { siteConfig } from "@/config/site";

export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteConfig.seo.baseUrl || "https://mahaveerenterprises.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
