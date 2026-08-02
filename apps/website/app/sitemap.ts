import type { MetadataRoute } from "next";
import { blogPostSlugs } from "@/lib/blog";
import { wissenArticleSlugs } from "@/lib/content/wissen-articles";
import { siteOrigin } from "@/lib/seo";

const routes = [
  "",
  "/leistungen",
  "/preise",
  "/prozess",
  "/plattform",
  "/referenzen",
  "/blog",
  ...blogPostSlugs().map((slug) => `/blog/${slug}`),
  "/wissen",
  ...wissenArticleSlugs().map((slug) => `/wissen/${slug}`),
  "/faq",
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
    changeFrequency:
      r === "" || r.startsWith("/wissen/") || r.startsWith("/blog") ? "weekly" : "monthly",
    priority:
      r === ""
        ? 1
        : r === "/blog" || r.startsWith("/blog/")
          ? 0.8
          : r.startsWith("/wissen/")
            ? 0.75
            : 0.7,
  }));
}
