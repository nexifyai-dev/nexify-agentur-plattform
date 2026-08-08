import type { MetadataRoute } from "next";
import { wissenArticleSlugs } from "@/lib/content/wissen-articles";
import { branchenSlugs } from "@/lib/gtm/branchen";
import { leistungSeoSlugs } from "@/lib/gtm/leistungen-seo";
import { siteOrigin } from "@/lib/seo";

/**
 * Sitemap SoT for GSC — only URLs that exist as unprefixed Emergent routes.
 * Do NOT list soft-404s, locale-prefixed paths, or missing page files.
 *
 * Pending: add further comparison/service detail routes only after real page.tsx files ship.
 */
const staticRoutes: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
}[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/leistungen", priority: 0.95, changeFrequency: "weekly" },
  { path: "/branchen", priority: 0.9, changeFrequency: "weekly" },
  { path: "/audit", priority: 0.9, changeFrequency: "monthly" },
  { path: "/preise", priority: 0.95, changeFrequency: "weekly" },
  { path: "/vergleich", priority: 0.9, changeFrequency: "weekly" },
  { path: "/prozess", priority: 0.85, changeFrequency: "monthly" },
  { path: "/plattform", priority: 0.85, changeFrequency: "monthly" },
  { path: "/checkliste", priority: 0.85, changeFrequency: "monthly" },
  { path: "/ebook", priority: 0.85, changeFrequency: "monthly" },
  { path: "/alternativen", priority: 0.85, changeFrequency: "monthly" },
  { path: "/partner", priority: 0.8, changeFrequency: "monthly" },
  { path: "/botschafter", priority: 0.8, changeFrequency: "monthly" },
  { path: "/sprechstunde", priority: 0.8, changeFrequency: "monthly" },
  { path: "/referenzen", priority: 0.8, changeFrequency: "monthly" },
  { path: "/erfahrungen", priority: 0.8, changeFrequency: "monthly" },
  { path: "/wissen", priority: 0.8, changeFrequency: "weekly" },
  { path: "/faq", priority: 0.8, changeFrequency: "monthly" },
  { path: "/ueber-mich", priority: 0.75, changeFrequency: "monthly" },
  { path: "/venlo", priority: 0.75, changeFrequency: "monthly" },
  { path: "/kontakt", priority: 0.9, changeFrequency: "monthly" },
  { path: "/rueckruf", priority: 0.9, changeFrequency: "monthly" },
  { path: "/impressum", priority: 0.3, changeFrequency: "yearly" },
  { path: "/datenschutz", priority: 0.3, changeFrequency: "yearly" },
  { path: "/agb", priority: 0.3, changeFrequency: "yearly" },
  { path: "/avv", priority: 0.3, changeFrequency: "yearly" },
  { path: "/widerruf", priority: 0.3, changeFrequency: "yearly" },
  { path: "/cookie-richtlinie", priority: 0.3, changeFrequency: "yearly" },
  { path: "/ki-hinweise", priority: 0.4, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteOrigin();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: r.path ? `${base}${r.path}` : `${base}/`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const leistungEntries: MetadataRoute.Sitemap = leistungSeoSlugs().map((slug) => ({
    url: `${base}/leistungen/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const branchenEntries: MetadataRoute.Sitemap = branchenSlugs().map((slug) => ({
    url: `${base}/branchen/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const wissenEntries: MetadataRoute.Sitemap = wissenArticleSlugs().map((slug) => ({
    url: `${base}/wissen/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...staticEntries, ...leistungEntries, ...branchenEntries, ...wissenEntries];
}
