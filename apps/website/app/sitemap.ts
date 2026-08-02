import type { MetadataRoute } from "next";
import { blogPostSlugs } from "@/lib/blog";
import { wissenArticleSlugs } from "@/lib/content/wissen-articles";
import { branchenSlugs } from "@/lib/gtm/branchen";
import { leistungSeoSlugs } from "@/lib/gtm/leistungen-seo";
import { siteOrigin } from "@/lib/seo";

const routes = [
  "",
  "/leistungen",
  ...leistungSeoSlugs().map((slug) => `/leistungen/${slug}`),
  "/branchen",
  ...branchenSlugs().map((slug) => `/branchen/${slug}`),
  "/audit",
  "/preise",
  "/prozess",
  "/vergleich",
  "/plattform",
  "/referenzen",
  "/blog",
  ...blogPostSlugs().map((slug) => `/blog/${slug}`),
  "/wissen",
  ...wissenArticleSlugs().map((slug) => `/wissen/${slug}`),
  "/faq",
  "/checkliste",
  "/botschafter",
  "/partner",
  "/sprechstunde",
  "/alternativen",
  "/vergleich/chatgpt",
  "/vergleich/freelance",
  "/ki-agentur",
  "/ueber-mich",
  "/venlo",
  "/danke",
  "/kontakt",
  "/rueckruf",
  "/danke",
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
  return routes.map((r) => {
    const isHome = r === "";
    const isLeistung = r.startsWith("/leistungen/");
    const isBlog = r === "/blog" || r.startsWith("/blog/");
    const isWissen = r.startsWith("/wissen/");
    return {
      url: isHome ? `${base}/` : `${base}${r}`,
      lastModified: new Date(),
      changeFrequency: isHome || isLeistung || isBlog || isWissen ? "weekly" : "monthly",
      priority: isHome ? 1 : isLeistung ? 0.85 : isBlog ? 0.8 : isWissen ? 0.75 : 0.7,
    };
  });
}
