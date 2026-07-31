import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/seo";

const routes = [
  "",
  "/leistungen",
  "/preise",
  "/prozess",
  "/plattform",
  "/referenzen",
  "/wissen",
  "/faq",
  "/ueber-mich",
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
    changeFrequency: r === "" ? "weekly" : "monthly",
    priority: r === "" ? 1 : 0.7,
  }));
}
