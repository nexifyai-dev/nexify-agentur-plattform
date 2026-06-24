import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { company } from "@/lib/site-data";
import "./globals.css";


export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? company.website),
  title: { default: "NeXify AI — AI-gestützte Websites, Apps & Automatisierung", template: "%s | NeXify AI" },
  description: "AI-gestützte Websites, Onlineshops, Web-Apps, mobile Apps und Automatisierungen. Persönlich umgesetzt zum transparenten Tagessatz von 999 Euro netto.",
  keywords: ["Webentwicklung", "Webdesign", "Next.js Agentur", "Onlineshop Entwicklung", "Web-App Entwicklung", "AI-gestützte Automatisierung", "NeXify AI"],
  authors: [{ name: company.owner }],
  creator: company.owner,
  publisher: company.legalName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: company.website,
    siteName: company.brand,
    title: "NeXify AI — Fachmann. Moderne AI. Faire Projektdauer.",
    description: "Premium-Websites und Software mit persönlicher Verantwortung und AI-gestützter Geschwindigkeit.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#08090a", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: company.legalName,
    url: company.website,
    email: company.email,
    telephone: company.phone,
    founder: { "@type": "Person", name: company.owner },
    address: { "@type": "PostalAddress", streetAddress: company.address, postalCode: "5921 JA", addressLocality: "Venlo", addressCountry: "NL" },
    areaServed: ["DE", "AT", "CH", "NL"],
    priceRange: "€€",
  };
  return (
    <html lang="de">
      <body>
        <a className="skip-link" href="#main-content">Zum Inhalt springen</a>
        <SiteHeader />
        <div id="main-content">{children}</div>
        <SiteFooter />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
