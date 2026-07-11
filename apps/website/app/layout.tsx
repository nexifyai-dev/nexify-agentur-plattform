import type { Metadata, Viewport } from "next";
import { Outfit, Manrope } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ChatWidget } from "@/components/chat-widget";
import { CookieConsent } from "@/components/cookie-consent";
import { PwaRegister } from "@/components/pwa-register";
import { LanguageProvider } from "@/lib/lang-context";
import { AuthProvider } from "@/lib/auth";
import { company } from "@/lib/company";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", weight: ["300", "400", "500", "600", "700"] });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? company.website),
  title: { default: "NeXify AI — Premium Websites, Apps & AI-Automatisierung", template: "%s | NeXify AI" },
  description:
    "AI-gestützte Websites, Onlineshops, Web-Apps, mobile Apps und Automatisierungen. Persönlich umgesetzt zum transparenten Tagessatz von 999 Euro netto. Deutsch & Nederlands.",
  keywords: [
    "Webentwicklung", "Webdesign", "Next.js Agentur", "Onlineshop Entwicklung", "Web-App Entwicklung",
    "AI-gestützte Automatisierung", "AI-Agenten", "NeXify AI", "Venlo", "webontwikkeling", "AI-automatisering",
  ],
  authors: [{ name: company.owner }],
  creator: company.owner,
  publisher: company.legalName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    alternateLocale: "nl_NL",
    url: company.website,
    siteName: company.brand,
    title: "NeXify AI — Chat it. Automate it.",
    description: "Premium-Websites und Software mit persönlicher Verantwortung und AI-gestützter Geschwindigkeit.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "NeXify AI — Chat it. Automate it." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NeXify AI — Chat it. Automate it.",
    description: "Premium-Websites, Shops, Apps und AI-Automatisierung. € 999 / Arbeitstag netto.",
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

export const viewport: Viewport = { themeColor: "#09090b", colorScheme: "dark" };

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
    <html lang="de" data-scroll-behavior="smooth" className={`${outfit.variable} ${manrope.variable}`}>
      <head>
        {/* Fail-safe: scroll-reveal starts at opacity:0 and is un-hidden by JS.
            Without JS (or if it fails to run) the whole page below the fold would
            stay invisible — force it visible so content always renders. */}
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
          <div id="main-content">{children}</div>
          <SiteFooter />
          <ChatWidget />
          <CookieConsent />
          <PwaRegister />
          </AuthProvider>
        </LanguageProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
