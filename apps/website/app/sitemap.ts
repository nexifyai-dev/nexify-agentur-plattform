import type { MetadataRoute } from "next";
import { company } from "@/lib/company";

const routes = [
  "", "/leistungen", "/preise", "/prozess", "/plattform", "/referenzen", "/wissen", "/faq", "/ueber-mich", "/kontakt", "/rueckruf",
  "/impressum", "/datenschutz", "/agb", "/avv", "/widerruf", "/cookie-richtlinie", "/ki-hinweise",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? company.website;
  return routes.map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
    changeFrequency: r === "" ? "weekly" : "monthly",
    priority: r === "" ? 1 : 0.7,
  }));
}
