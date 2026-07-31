import type { Metadata } from "next";
import { company } from "./company";

/** Primär-Host laut Audit/Decision: www (apex → www via CF/Vercel). */
export const CANONICAL_ORIGIN = "https://www.nexifyai.cloud";

/**
 * Normalisiert NEXT_PUBLIC_SITE_URL auf www-Primärhost.
 * Verhindert Split-Authority (canonical apex vs. og:url www).
 */
export function siteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || company.website;
  try {
    const u = new URL(raw);
    if (u.hostname === "nexifyai.cloud") u.hostname = "www.nexifyai.cloud";
    return u.origin.replace(/\/$/, "");
  } catch {
    return CANONICAL_ORIGIN;
  }
}

export function absoluteUrl(path = "/"): string {
  const normalized = path === "" || path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
  return normalized === "/" ? `${siteOrigin()}/` : `${siteOrigin()}${normalized}`;
}

type PageSeoInput = {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
  ogDescription?: string;
  noIndex?: boolean;
};

/** Seitenspezifische Metadata inkl. canonical + og:url (nie Root erben). */
export function pageMetadata({
  title,
  description,
  path,
  ogTitle,
  ogDescription,
  noIndex,
}: PageSeoInput): Metadata {
  const canonicalPath = path === "" || path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
  const url = absoluteUrl(canonicalPath);
  const ogT = ogTitle ?? title;
  const ogD = ogDescription ?? description;

  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: ogT,
      description: ogD,
      url,
      type: "website",
    },
    twitter: {
      title: ogT,
      description: ogD,
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export type BreadcrumbItem = {
  name: string;
  /** Absolute path, e.g. `/` or `/faq`. */
  path: string;
};

/** schema.org BreadcrumbList — server-side JSON-LD, absolute www URLs. */
export function breadcrumbListJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Escape `<` so inline JSON-LD cannot break out of the script tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
