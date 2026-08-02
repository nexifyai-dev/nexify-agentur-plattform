import type { MetadataRoute } from "next";
import { branchenSlugs } from "@/lib/content/branchen";
import { wissenArticleSlugs } from "@/lib/content/wissen-articles";
import { siteOrigin } from "@/lib/seo";

const routes = [
  "",
  "/leistungen",
  "/branchen",
  ...branchenSlugs().map((slug) => `/branchen/${slug}`),
  "/preise",
  "/prozess",
  "/vergleich",
  "/plattform",
  "/referenzen",
  "/wissen",
  ...wissenArticleSlugs().map((slug) => `/wissen/${slug}`),
  "/faq",
  "/vergleich",
  "/checkliste",
  "/ueber-mich",
  "/venlo",
  "/kontakt",
  "/rueckruf",
  "/impressum",
  "/datenschutz",
  "/agb",
  "/avv",
  "/widerruf",
  "/cookie-richtlinie",
  "/ki-hinweise",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteOrigin();
  return routes.map((r) => ({
    url: r ? `${base}${r}` : `${base}/`,
    lastModified: new Date(),
    changeFrequency: r === "" || r.startsWith("/wissen/") ? "weekly" : "monthly",
    priority: r === "" ? 1 : r.startsWith("/wissen/") ? 0.75 : 0.7,
  }));
}
