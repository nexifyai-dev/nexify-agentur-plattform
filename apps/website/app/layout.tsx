import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/outfit";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { DeferredWidgets } from "@/components/deferred-widgets";
import { PwaRegister } from "@/components/pwa-register";
import { LanguageProvider } from "@/lib/lang-context";
import { AuthProvider } from "@/lib/auth";
import { company } from "@/lib/company";
import { siteOrigin } from "@/lib/seo";
import "./globals.css";
import "./nexify-anhang.css";

const origin = siteOrigin();

export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: { default: "NeXify AI — KI-Agenten für Ihr Unternehmen · Auf Autopilot.", template: "%s | NeXify AI" },
  description:
    "NeXify AI plant, baut und betreibt KI-Agenten, die Anfragen beantworten, Termine buchen und Prozesse automatisieren. 449 €/Umsetzungstag. Deutsch & Nederlands. Chat it. Automate it.",
  keywords: [
    "KI Agenten", "Automatisierung", "Chatbot", "Terminbuchung", "KI Agentur", "NeXify AI",
    "Prozessautomatisierung", "E-Mail Triage", "Leadqualifizierung", "Wissensdatenbank",
  ],
  authors: [{ name: company.owner }],
  creator: company.owner,
  publisher: company.legalName,
  alternates: {
    languages: {
      de: "/",
      en: "/",
      nl: "/",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    alternateLocale: ["nl_NL"],
    siteName: company.brand,
    title: "NeXify AI — KI-Agenten für Ihr Unternehmen · Auf Autopilot.",
    description: "KI-Agenten für Betriebe. 449 € / Umsetzungstag. Deutsch & Nederlands. Chat it. Automate it.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "NeXify AI — Chat it. Automate it." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NeXify AI — KI-Agenten für Ihr Unternehmen · Auf Autopilot.",
    description: "KI-Agenten für Betriebe. 449 € / Umsetzungstag netto.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "NeXify AI" },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "48x48" }, { url: "/icon.svg", type: "image/svg+xml" }, { url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = { themeColor: "#0A0A0A", colorScheme: "dark", viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    name: company.legalName,
    brand: company.brand,
    url: origin,
    email: company.email,
    telephone: company.phone,
    founder: { "@type": "Person", name: company.owner },
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address,
      postalCode: "5921 JA",
      addressLocality: "Venlo",
      addressCountry: "NL",
    },
    areaServed: ["DE", "AT", "CH", "NL"],
    priceRange: "€€",
    makesOffer: {
      "@type": "Offer",
      price: String(company.dayRate),
      priceCurrency: "EUR",
      description: "Tagessatz netto pro Umsetzungstag",
      unitText: "DAY",
    },
  };
  return (
    <html lang="de" data-scroll-behavior="smooth">
      <head>
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important;}`}</style>
        </noscript>
      </head>
      <body>
        <LanguageProvider>
          <AuthProvider>
          <a className="skip-link" href="#main-content">
            Zum Inhalt springen
          </a>
          <SiteHeader />
          <div id="main-content" className="min-h-[100svh]">{children}</div>
          <SiteFooter />
          <DeferredWidgets />
          <PwaRegister />
          </AuthProvider>
        </LanguageProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
