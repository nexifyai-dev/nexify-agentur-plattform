import type { Metadata, Viewport } from "next";
import { Inter_Tight, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { CustomCursor } from "@/components/custom-cursor";
import { ScrollProgress } from "@/components/scroll-progress";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StickyCta } from "@/components/sticky-cta";
import { company } from "@/lib/site-data";
import { getTranslations, isValidLocale, type Locale, locales } from "@/lib/i18n";
import "../globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["300", "400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500"],
});

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
      languages: {
        de: "/de",
        en: "/en",
        nl: "/nl",
        "x-default": "/de",
      },
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

export const viewport: Viewport = { themeColor: "#0A0A0A", colorScheme: "dark" };

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
    <html lang={locale} className={`${interTight.variable} ${ibmPlexSans.variable} ${jetbrainsMono.variable}`}>
      <body>
        <CustomCursor />
        <ScrollProgress />
        <StickyCta />
        <a className="skip-link" href="#main-content">Zum Inhalt springen</a>
        {/* SiteHeader/SiteFooter still resolve language from client-side lang-context (useLang()),
            not from the URL locale segment — see master audit plan for the architecture
            reconciliation needed to make them locale-aware server-side. */}
        <SiteHeader />
        <main id="main-content" role="main">{children}</main>
        <SiteFooter />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
