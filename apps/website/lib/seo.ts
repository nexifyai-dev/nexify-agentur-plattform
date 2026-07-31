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

type ArticleJsonLdInput = {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
};

/** schema.org Article — server-side JSON-LD for crawlable Wissen posts. */
export function articleJsonLd({
  title,
  description,
  path,
  datePublished,
  dateModified,
}: ArticleJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished,
    dateModified: dateModified ?? datePublished,
    mainEntityOfPage: absoluteUrl(path),
    author: {
      "@type": "Organization",
      name: company.brand,
      url: siteOrigin(),
    },
    publisher: {
      "@type": "Organization",
      name: company.brand,
      url: siteOrigin(),
    },
  };
}

/** schema.org LocalBusiness + Place — local SEO landing (e.g. /venlo). */
export function localBusinessPlaceJsonLd(path = "/venlo") {
  const postalAddress = {
    "@type": "PostalAddress" as const,
    streetAddress: company.address,
    postalCode: "5921 JA",
    addressLocality: "Venlo",
    addressRegion: "Limburg",
    addressCountry: "NL",
  };
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    name: company.legalName,
    brand: company.brand,
    url: absoluteUrl(path),
    email: company.email,
    telephone: company.phone,
    priceRange: "€€",
    address: postalAddress,
    location: {
      "@type": "Place",
      name: `${company.brand} — Venlo`,
      address: postalAddress,
    },
    areaServed: [
      { "@type": "City", name: "Venlo" },
      { "@type": "Country", name: "Netherlands" },
      { "@type": "Country", name: "Germany" },
      { "@type": "Country", name: "Austria" },
      { "@type": "Country", name: "Switzerland" },
    ],
    makesOffer: {
      "@type": "Offer",
      price: String(company.dayRate),
      priceCurrency: "EUR",
      description: "Tagessatz netto pro Arbeitstag (bis zu acht planbare Fachstunden)",
      unitText: "DAY",
    },
  };
}

/** Escape `<` so inline JSON-LD cannot break out of the script tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
