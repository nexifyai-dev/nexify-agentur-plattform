import type { MetadataRoute } from "next";
import { legalPages } from "@/lib/legal-content";
import { company, services } from "@/lib/site-data";

const locales = ["de", "en", "nl"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? company.website;

  const pagePaths: Array<{ path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }> = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/leistungen", priority: 0.9, changeFrequency: "monthly" },
    { path: "/preise", priority: 0.9, changeFrequency: "monthly" },
    { path: "/prozess", priority: 0.8, changeFrequency: "monthly" },
    { path: "/ueber-mich", priority: 0.7, changeFrequency: "monthly" },
    { path: "/kontakt", priority: 0.9, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
    { path: "/referenzen", priority: 0.7, changeFrequency: "monthly" },
    { path: "/wissen", priority: 0.6, changeFrequency: "monthly" },
    ...services.map((s) => ({ path: `/leistungen/${s.slug}`, priority: 0.8, changeFrequency: "monthly" as const })),
    ...Object.keys(legalPages).map((s) => ({ path: `/${s}`, priority: 0.3, changeFrequency: "yearly" as const })),
  ];

  // Generate entries for all locales
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const { path, priority, changeFrequency } of pagePaths) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: now,
        changeFrequency,
        priority: locale === "de" ? priority : priority * 0.8, // DE gets full priority
      });
    }
  }

  return entries;
}
