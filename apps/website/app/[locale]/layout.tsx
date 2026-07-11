import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CustomCursor } from "@/components/custom-cursor";
import { ScrollProgress } from "@/components/scroll-progress";
import { StickyCta } from "@/components/sticky-cta";
import { company } from "@/lib/site-data";
import { getTranslations, isValidLocale, type Locale, locales } from "@/lib/i18n";

// NOTE: This is a NESTED layout under the root app/layout.tsx, which already
// provides <html>/<body>, fonts, globals.css, providers, header and footer.
// It must NOT render a second <html>/<body>/<SiteHeader>/<SiteFooter> — doing so
// produced two stacked headers and nested invalid HTML in production, which broke
// stylesheet application. It only adds per-locale SEO metadata, JSON-LD and the
// decorative client extras.

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const t = getTranslations(locale as Locale);
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? company.website),
    title: { default: t.meta.title, template: "%s | NeXify AI" },
    description: t.meta.description,
    keywords: [
      "Webentwicklung Agentur", "Website erstellen lassen", "Next.js Entwicklung",
      "Onlineshop entwickeln", "Web-App Entwicklung", "AI-gestützte Automatisierung",
      "B2B Webdesign", "Website in 3 Tagen", "NeXify AI", "Pascal Courbois",
    ],
    authors: [{ name: company.owner }],
    creator: company.owner,
    publisher: company.legalName,
    alternates: {
      canonical: `/${locale}`,
      languages: { de: "/de", en: "/en", nl: "/nl", "x-default": "/de" },
    },
    openGraph: {
      type: "website",
      locale: locale === "de" ? "de_DE" : locale === "nl" ? "nl_NL" : "en_US",
      url: `${company.website}/${locale}`,
      siteName: company.brand,
      title: t.meta.title,
      description: t.meta.description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: company.legalName,
    url: `${company.website}/${locale}`,
    email: company.email,
    telephone: company.phone,
    founder: { "@type": "Person", name: company.owner, jobTitle: "Inhaber" },
    address: { "@type": "PostalAddress", streetAddress: company.address, postalCode: "5921 JA", addressLocality: "Venlo", addressCountry: "NL" },
    areaServed: ["DE", "AT", "CH", "NL"],
    priceRange: "€€",
  };

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <StickyCta />
      {children}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
