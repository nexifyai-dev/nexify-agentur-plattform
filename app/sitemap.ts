import type { MetadataRoute } from "next";
import { legalPages } from "@/lib/legal-content";
import { company, services } from "@/lib/site-data";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/leistungen", "/preise", "/prozess", "/ueber-mich", "/kontakt", "/faq", "/referenzen", "/plattform", "/wissen", ...services.map((s) => `/leistungen/${s.slug}`), ...Object.keys(legalPages).map((s) => `/${s}`)];
  return paths.map((path) => ({ url: `${company.website}${path}`, lastModified: new Date(), changeFrequency: path === "" ? "weekly" : "monthly", priority: path === "" ? 1 : 0.7 }));
}
