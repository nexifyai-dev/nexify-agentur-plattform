import type { MetadataRoute } from "next";
import { wissenArticleSlugs } from "@/lib/content/wissen-articles";
import { siteOrigin } from "@/lib/seo";

const routes = [
  "",
  "/leistungen",
  "/preise",
  "/prozess",
  "/vergleich",
  "/plattform",
  "/referenzen",
  "/wissen",
  ...wissenArticleSlugs().map((slug) => `/wissen/${slug}`),
  "/faq",
  "/checkliste",
  "/botschafter",
  "/partner",
  "/sprechstunde",
  "/alternativen",
  "/vergleich",
  "/vergleich/chatgpt",
  "/vergleich/freelance",
  "/checkliste",
  "/ki-agentur",
  "/partner",
  "/alternativen",
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
