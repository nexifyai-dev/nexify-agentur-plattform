'use client';

import Link from 'next/link';
import { NxLogoMark } from '@/components/site-header';
import { company } from '@/lib/company';
import { useLang } from '@/lib/lang-context';

const T = {
  de: {
    tagline: 'chat it. automate it. KI-Automatisierung für Betriebe im DACH- und NL-Raum.',
    company: 'Unternehmen',
    product: 'Produkt',
    legal: 'Recht',
    contact: 'Kontakt',
    companyLinks: [
      { label: 'Über uns', href: '/ueber-mich' },
      { label: 'Referenzen', href: '/referenzen' },
      { label: 'Karriere', href: '/karriere' },
      { label: 'Kontakt', href: '/kontakt' },
    ],
    productLinks: [
      { label: 'Leistungen', href: '/leistungen' },
      { label: 'Preise', href: '/preise' },
      { label: 'Prozess', href: '/prozess' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Wissen', href: '/wissen' },
      { label: 'Plattform', href: '/plattform' },
      { label: 'API Docs', href: 'https://api.nexifyai.cloud/docs', external: true },
    ],
    legalLinks: [
      { label: 'Impressum', href: '/impressum' },
      { label: 'Datenschutz', href: '/datenschutz' },
      { label: 'AGB', href: '/agb' },
      { label: 'AVV', href: '/avv' },
      { label: 'Widerruf', href: '/widerruf' },
      { label: 'Cookie-Richtlinie', href: '/cookie-richtlinie' },
      { label: 'KI-Hinweise', href: '/ki-hinweise' },
    ],
    callback: 'Rückruf-Termin buchen →',
    cookieSettings: 'Cookie-Einstellungen',
    rights: 'Alle Rechte vorbehalten.',
    b2b: 'Angebote richten sich ausschließlich an Unternehmen (B2B).',
  },
  en: {
    tagline: 'chat it. automate it. AI automation for businesses in DACH and the NL.',
    company: 'Company',
    product: 'Product',
    legal: 'Legal',
    contact: 'Contact',
    companyLinks: [
      { label: 'About', href: '/ueber-mich' },
      { label: 'References', href: '/referenzen' },
      { label: 'Careers', href: '/karriere' },
      { label: 'Contact', href: '/kontakt' },
    ],
    productLinks: [
      { label: 'Services', href: '/leistungen' },
      { label: 'Pricing', href: '/preise' },
      { label: 'Process', href: '/prozess' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Knowledge', href: '/wissen' },
      { label: 'Platform', href: '/plattform' },
      { label: 'API Docs', href: 'https://api.nexifyai.cloud/docs', external: true },
    ],
    legalLinks: [
      { label: 'Imprint', href: '/impressum' },
      { label: 'Privacy', href: '/datenschutz' },
      { label: 'Terms', href: '/agb' },
      { label: 'DPA', href: '/avv' },
      { label: 'Withdrawal', href: '/widerruf' },
      { label: 'Cookie Policy', href: '/cookie-richtlinie' },
      { label: 'AI Notice', href: '/ki-hinweise' },
    ],
    callback: 'Book a callback →',
    cookieSettings: 'Cookie settings',
    rights: 'All rights reserved.',
    b2b: 'Offers are exclusively directed at businesses (B2B).',
  },
  nl: {
    tagline: 'chat it. automate it. AI-automatisering voor bedrijven in DACH en NL.',
    company: 'Bedrijf',
    product: 'Product',
    legal: 'Juridisch',
    contact: 'Contact',
    companyLinks: [
      { label: 'Over ons', href: '/ueber-mich' },
      { label: 'Referenties', href: '/referenzen' },
      { label: 'Vacatures', href: '/karriere' },
      { label: 'Contact', href: '/kontakt' },
    ],
    productLinks: [
      { label: 'Diensten', href: '/leistungen' },
      { label: 'Prijzen', href: '/preise' },
      { label: 'Proces', href: '/prozess' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Kennis', href: '/wissen' },
      { label: 'Platform', href: '/plattform' },
      { label: 'API Docs', href: 'https://api.nexifyai.cloud/docs', external: true },
    ],
    legalLinks: [
      { label: 'Colofon', href: '/impressum' },
      { label: 'Privacyverklaring', href: '/datenschutz' },
      { label: 'Algemene voorwaarden', href: '/agb' },
      { label: 'Verwerkersovereenkomst', href: '/avv' },
      { label: 'Herroeping', href: '/widerruf' },
      { label: 'Cookiebeleid', href: '/cookie-richtlinie' },
      { label: 'AI-verklaring', href: '/ki-hinweise' },
    ],
    callback: 'Terugbelafspraak boeken →',
    cookieSettings: 'Cookie-instellingen',
    rights: 'Alle rechten voorbehouden.',
    b2b: 'Aanbiedingen zijn uitsluitend gericht op ondernemingen (B2B).',
  },
} as const;

const footerColLabel: React.CSSProperties = {
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.16em',
  color: '#585858',
  fontWeight: 600,
};

export function SiteFooter() {
  const { lang } = useLang();
  const t = T[lang];
  const prefix = lang === 'de' ? '' : `/${lang}`;
  const href = (h: string) => `${prefix}${h}`;

  return (
    <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.08)', padding: '64px 0 40px' }}>
      <div
        className="nx-3col"
        style={{
          width: 'min(1280px, calc(100% - 48px))',
          marginInline: 'auto',
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr 1fr 1fr',
          gap: 40,
        }}
      >
        <div>
          <span style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <NxLogoMark />
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: 16 }}>
              NeXify <span style={{ fontWeight: 300, color: '#9E9E9E' }}>AI</span>
            </span>
          </span>
          <p style={{ marginTop: 14, maxWidth: 280, fontSize: 13, lineHeight: 1.7, color: '#71717a', fontWeight: 300 }}>
            {t.tagline}
          </p>
        </div>
        <div>
          <div style={footerColLabel}>{t.company}</div>
          <div style={{ marginTop: 16, display: 'grid', gap: 11 }}>
            {t.companyLinks.map((l) => (
              <Link key={l.label} href={href(l.href)} style={{ fontSize: 13, color: '#71717a' }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div style={footerColLabel}>{t.product}</div>
          <div style={{ marginTop: 16, display: 'grid', gap: 11 }}>
            {t.productLinks.map((l) => (
              <Link
                key={l.label}
                href={'external' in l && l.external ? l.href : href(l.href)}
                style={{ fontSize: 13, color: '#71717a' }}
                {...('external' in l && l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div style={footerColLabel}>{t.legal}</div>
          <div style={{ marginTop: 16, display: 'grid', gap: 11 }}>
            {t.legalLinks.map((l) => (
              <Link
                key={l.label}
                href={href(l.href)}
                style={{ fontSize: 13, color: '#71717a' }}
                data-testid={`footer-legal-${l.href.slice(1)}`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Kontakt-Zeile: Pflichtdaten (Adresse, Mail, Tel, WhatsApp, Cookie-Settings, Rückruf) */}
      <div
        style={{
          width: 'min(1280px, calc(100% - 48px))',
          marginInline: 'auto',
          marginTop: 40,
          paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'grid',
          gap: 16,
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          fontSize: 12.5,
          color: '#71717a',
        }}
      >
        <div style={{ display: 'grid', gap: 6 }}>
          <span style={{ fontWeight: 600, color: '#a1a1aa' }}>{company.legalName}</span>
          <span>{company.owner}</span>
          <span>
            {company.address}, {company.postalCity}
          </span>
          <span>{lang === 'nl' ? company.countryNl : company.country}</span>
        </div>
        <div style={{ display: 'grid', gap: 6 }}>
          <a href={`mailto:${company.email}`} style={{ color: '#71717a' }}>
            {company.email}
          </a>
          <a href={`tel:${company.phoneHref}`} style={{ color: '#71717a' }}>
            {company.phone}
          </a>
          <a
            href={`https://wa.me/${company.phoneHref.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#71717a' }}
            data-testid="footer-whatsapp-link"
          >
            WhatsApp
          </a>
          <button
            type="button"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', color: '#71717a', fontSize: 12.5 }}
            onClick={() => window.dispatchEvent(new CustomEvent('nexify-open-consent'))}
            data-testid="footer-cookie-settings"
          >
            {t.cookieSettings}
          </button>
        </div>
        <div style={{ display: 'grid', gap: 6 }}>
          <Link href={href('/rueckruf')} style={{ color: '#a1a1aa', fontWeight: 600 }} data-testid="footer-callback-link">
            {t.callback}
          </Link>
          <span>
            KvK {company.kvk} · BTW {company.vatId}
          </span>
        </div>
      </div>

      <div
        style={{
          width: 'min(1280px, calc(100% - 48px))',
          marginInline: 'auto',
          marginTop: 32,
          paddingTop: 24,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          fontSize: 11.5,
          color: '#52525b',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <span>
          © 2026 {company.legalName}. {t.rights}
        </span>
        <span>{t.b2b}</span>
      </div>
    </footer>
  );
}
