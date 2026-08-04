import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/seo";

/**
 * robots.txt — Googlebot/Bingbot first-class; private + auth paths blocked.
 * Host + single Sitemap (unprefixed www). No locale sitemaps.
 */
export default function robots(): MetadataRoute.Robots {
  const base = siteOrigin();
  const host = base.replace(/^https?:\/\//, "");
  const disallow = ["/admin", "/konto", "/login", "/registrieren", "/api/", "/danke"];

  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow,
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
        disallow,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow,
      },
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host,
  };
}
