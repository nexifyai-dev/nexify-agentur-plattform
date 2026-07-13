"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { company } from "@/lib/company";
import { useLang } from "@/lib/lang-context";

const T = {
  de: {
    tagline: "Premium-Websites, Shops, Apps und AI-Automatisierung – persönlich verantwortet, AI-beschleunigt, transparent zum Tagessatz.",
    nav: "Navigation",
    services: "Leistungen",
    legal: "Rechtliches",
    contact: "Kontakt",
    links: [
      { label: "Leistungen", href: "/leistungen" },
      { label: "Preise", href: "/preise" },
      { label: "Prozess", href: "/prozess" },
      { label: "Plattform", href: "/plattform" },
      { label: "Referenzen", href: "/referenzen" },
      { label: "Wissen", href: "/wissen" },
      { label: "FAQ", href: "/faq" },
      { label: "Über mich", href: "/ueber-mich" },
    ],
    legalLinks: [
      { label: "Impressum", href: "/impressum" },
      { label: "Datenschutz", href: "/datenschutz" },
      { label: "AGB", href: "/agb" },
      { label: "AVV", href: "/avv" },
      { label: "Widerruf", href: "/widerruf" },
      { label: "Cookie-Richtlinie", href: "/cookie-richtlinie" },
      { label: "KI-Hinweise", href: "/ki-hinweise" },
    ],
    b2b: "Angebote richten sich ausschließlich an Unternehmen (B2B).",
    rights: "Alle Rechte vorbehalten.",
  },
  en: {
    tagline: "Premium websites, shops, apps and AI automation – personally accountable, AI-accelerated, transparent at a daily rate.",
    nav: "Navigation",
    services: "Services",
    legal: "Legal",
    contact: "Contact",
    links: [
      { label: "Services", href: "/leistungen" },
      { label: "Pricing", href: "/preise" },
      { label: "Process", href: "/prozess" },
      { label: "Platform", href: "/plattform" },
      { label: "References", href: "/referenzen" },
      { label: "Knowledge", href: "/wissen" },
      { label: "FAQ", href: "/faq" },
      { label: "About Me", href: "/ueber-mich" },
    ],
    legalLinks: [
      { label: "Imprint", href: "/impressum" },
      { label: "Privacy", href: "/datenschutz" },
      { label: "Terms", href: "/agb" },
      { label: "DPA", href: "/avv" },
      { label: "Withdrawal", href: "/widerruf" },
      { label: "Cookie Policy", href: "/cookie-richtlinie" },
      { label: "AI Notice", href: "/ki-hinweise" },
    ],
    b2b: "Offers are exclusively directed at businesses (B2B).",
    rights: "All rights reserved.",
  },
  nl: {
    tagline: "Premium websites, shops, apps en AI-automatisering – persoonlijk verantwoord, AI-versneld, transparant tegen dagtarief.",
    nav: "Navigatie",
    services: "Diensten",
    legal: "Juridisch",
    contact: "Contact",
    links: [
      { label: "Diensten", href: "/leistungen" },
      { label: "Prijzen", href: "/preise" },
      { label: "Proces", href: "/prozess" },
      { label: "Platform", href: "/plattform" },
      { label: "Referenties", href: "/referenzen" },
      { label: "Kennis", href: "/wissen" },
      { label: "FAQ", href: "/faq" },
      { label: "Over mij", href: "/ueber-mich" },
    ],
    legalLinks: [
      { label: "Colofon", href: "/impressum" },
      { label: "Privacyverklaring", href: "/datenschutz" },
      { label: "Algemene voorwaarden", href: "/agb" },
      { label: "Verwerkersovereenkomst", href: "/avv" },
      { label: "Herroeping", href: "/widerruf" },
      { label: "Cookiebeleid", href: "/cookie-richtlinie" },
      { label: "AI-verklaring", href: "/ki-hinweise" },
    ],
    b2b: "Aanbiedingen zijn uitsluitend gericht op ondernemingen (B2B).",
    rights: "Alle rechten voorbehouden.",
  },
};

export function SiteFooter() {
  const { lang } = useLang();
  const t = T[lang];

  return (
    <footer className="mt-28 border-t border-white/8 bg-black/40" data-testid="site-footer">
      <div className="site-container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-5 text-sm leading-relaxed text-zinc-500">{t.tagline}</p>
        </div>

        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t.nav}</h3>
          <ul className="mt-5 space-y-2.5">
            {t.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-zinc-400 transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t.legal}</h3>
          <ul className="mt-5 space-y-2.5">
            {t.legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-zinc-400 transition-colors hover:text-white" data-testid={`footer-legal-${l.href.slice(1)}`}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t.contact}</h3>
          <ul className="mt-5 space-y-2.5 text-sm text-zinc-400">
            <li>{company.legalName}</li>
            <li>{company.owner}</li>
            <li>
              {company.address}, {company.postalCity}
            </li>
            <li>{lang === "nl" ? company.countryNl : company.country}</li>
            <li>
              <a href={`mailto:${company.email}`} className="transition-colors hover:text-white">
                {company.email}
              </a>
            </li>
            <li>
              <a href={`tel:${company.phoneHref}`} className="transition-colors hover:text-white">
                {company.phone}
              </a>
            </li>
            <li>
              <Link href="/rueckruf" className="font-semibold text-zinc-300 transition-colors hover:text-white" data-testid="footer-callback-link">
                {lang === "nl" ? "Terugbelafspraak boeken →" : "Rückruf-Termin buchen →"}
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="transition-colors hover:text-white"
                onClick={() => window.dispatchEvent(new CustomEvent("nexify-open-consent"))}
                data-testid="footer-cookie-settings"
              >
                {lang === "nl" ? "Cookie-instellingen" : "Cookie-Einstellungen"}
              </button>
            </li>
            <li className="pt-2 text-xs text-zinc-600">
              KvK {company.kvk} · BTW {company.vatId}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="site-container flex flex-col items-start justify-between gap-2 py-6 text-xs text-zinc-600 md:flex-row md:items-center">
          <span>
            © {new Date().getFullYear()} {company.legalName}. {t.rights}
          </span>
          <span>{t.b2b}</span>
        </div>
      </div>
    </footer>
  );
}
