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

  // Nested openGraph/twitter replace parent shallowly — re-declare images + card
  // so pageMetadata does not drop root OG/Twitter share images (soft SEO regression).
  const ogImages = [
    {
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "NeXify AI — Chat it. Automate it.",
    },
  ];

  return {
    title,
    description,
    // Unprefixed routes + cookie/localStorage locale (de/en/nl) share one URL.
    // hreflang: de + x-default are primary (DE content); en/nl are alternates.
    // See docs/operations/LOCALE-DE-STANDARD.md
    alternates: {
      canonical: canonicalPath,
      languages: {
        de: canonicalPath,
        en: canonicalPath,
        nl: canonicalPath,
        "x-default": canonicalPath,
      },
    },
    openGraph: {
      title: ogT,
      description: ogD,
      url,
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: ogT,
      description: ogD,
      images: ["/og-image.png"],
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

type WebPageJsonLdInput = {
  title: string;
  description: string;
  path: string;
  dateModified?: string;
};

/** schema.org WebPage — legal/info pages (indexable). */
export function webPageJsonLd({ title, description, path, dateModified }: WebPageJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description,
    url: absoluteUrl(path),
    inLanguage: ["de", "nl", "en"],
    isPartOf: {
      "@type": "WebSite",
      name: company.brand,
      url: siteOrigin(),
    },
    ...(dateModified ? { dateModified } : {}),
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

export type ServiceOfferItem = {
  slug: string;
  name: string;
  description: string;
  minDays: number;
  maxDays?: number;
  from?: boolean;
};

/**
 * schema.org OfferCatalog of Service + Offer — services page SEO.
 * Prices = Tagessatz × Arbeitstage (netto); ranges use PriceSpecification.
 */
export function servicesOfferCatalogJsonLd(
  items: ServiceOfferItem[],
  path = "/leistungen",
) {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: `Leistungen — ${company.brand}`,
    description:
      "Leistungsbausteine zum festen Tagessatz: Websites, Shops, Apps, KI und Automatisierung.",
    url: absoluteUrl(path),
    numberOfItems: items.length,
    itemListElement: items.map((s, index) => {
      const minTotal = s.minDays * company.dayRate;
      const maxTotal = (s.maxDays ?? s.minDays) * company.dayRate;
      const ranged = Boolean(s.from) || (s.maxDays != null && s.maxDays !== s.minDays);
      const daysLabel =
        s.maxDays != null && s.maxDays !== s.minDays
          ? `${s.minDays}–${s.maxDays} Arbeitstage`
          : s.from
            ? `ab ${s.minDays} Arbeitstag(en)`
            : `${s.minDays} Arbeitstag${s.minDays === 1 ? "" : "e"}`;

      return {
        "@type": "Offer",
        position: index + 1,
        name: s.name,
        url: absoluteUrl(`${path}/${s.slug}`),
        description: `${daysLabel} à ${company.dayRate} € netto`,
        itemOffered: {
          "@type": "Service",
          name: s.name,
          description: s.description,
          url: absoluteUrl(`${path}/${s.slug}`),
          provider: {
            "@type": "Organization",
            name: company.legalName,
            url: siteOrigin(),
          },
          areaServed: ["DE", "AT", "CH", "NL"],
        },
        priceCurrency: "EUR",
        ...(ranged
          ? {
              priceSpecification: {
                "@type": "PriceSpecification",
                priceCurrency: "EUR",
                minPrice: String(minTotal),
                ...(s.maxDays != null ? { maxPrice: String(maxTotal) } : {}),
                unitText: "TOTAL",
              },
            }
          : {
              price: String(minTotal),
            }),
      };
    }),
  };
}

/** Escape `<` so inline JSON-LD cannot break out of the script tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * schema.org WebSite + SearchAction — homepage-level entity (M-02).
 * SearchAction targets the real SSR /suche route (no dead placeholder).
 */
export function websiteSearchActionJsonLd(path = "/") {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteOrigin()}/#website`,
    url: absoluteUrl(path),
    name: company.brand,
    alternateName: company.brandFull,
    inLanguage: ["de", "nl", "en"],
    publisher: {
      "@id": `${siteOrigin()}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteOrigin()}/suche?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** Organization entity — referenced by @id from page-level schemas. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteOrigin()}/#organization`,
    name: company.legalName,
    alternateName: [company.brand, company.brandFull],
    url: siteOrigin(),
    // sameAs: WhatsApp Business = einzige verifizierte externe Identität (M-02a).
    sameAs: [company.whatsappHref],
    logo: {
      "@type": "ImageObject",
      url: `${siteOrigin()}/logo-mark.png`,
    },
    email: company.email,
    telephone: company.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address,
      postalCode: "5921 JA",
      addressLocality: "Venlo",
      addressCountry: "NL",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: company.phone,
      email: company.email,
      areaServed: ["DE", "AT", "CH", "NL"],
      availableLanguage: ["de", "nl", "en"],
    },
  };
}

/** schema.org FAQPage from a list of Q/A pairs (M-02: any page with a FAQ block). */
export function faqPageJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
    inLanguage: "de",
  };
}
