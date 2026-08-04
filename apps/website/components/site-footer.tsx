'use client';

import Link from 'next/link';
import { NxLogoMark } from '@/components/site-header';
import { company } from '@/lib/company';

const COMPANY_LINKS = [
  { label: 'Über uns', href: '#ueberuns' },
  { label: 'Referenzen', href: '#referenzen' },
  { label: 'Kontakt', href: '#kontakt' },
];

const PRODUCT_LINKS = [
  { label: 'Leistungen', href: '#leistungen' },
  { label: 'Preise', href: '#preise' },
  { label: 'FAQ', href: '#faq' },
];

const LEGAL_LINKS = [
  { label: 'Impressum', href: '/impressum' },
  { label: 'Datenschutz', href: '/datenschutz' },
  { label: 'AGB', href: '/agb' },
  { label: 'AVV', href: '/avv' },
  { label: 'Widerruf', href: '/widerruf' },
  { label: 'Cookie-Richtlinie', href: '/cookie-richtlinie' },
  { label: 'KI-Hinweise', href: '/ki-hinweise' },
];

const footerColLabel: React.CSSProperties = {
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '0.16em',
  color: '#585858',
  fontWeight: 600,
};

export function SiteFooter() {
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
            chat it. automate it. KI-Automatisierung für Betriebe im DACH- und NL-Raum.
          </p>
        </div>
        <div>
          <div style={footerColLabel}>Unternehmen</div>
          <div style={{ marginTop: 16, display: 'grid', gap: 11 }}>
            {COMPANY_LINKS.map((l) => (
              <Link key={l.label} href={l.href} style={{ fontSize: 13, color: '#71717a' }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div style={footerColLabel}>Produkt</div>
          <div style={{ marginTop: 16, display: 'grid', gap: 11 }}>
            {PRODUCT_LINKS.map((l) => (
              <Link key={l.label} href={l.href} style={{ fontSize: 13, color: '#71717a' }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div style={footerColLabel}>Recht</div>
          <div style={{ marginTop: 16, display: 'grid', gap: 11 }}>
            {LEGAL_LINKS.map((l) => (
              <Link key={l.label} href={l.href} style={{ fontSize: 13, color: '#71717a' }} data-testid={`footer-legal-${l.href.slice(1)}`}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div
        style={{
          width: 'min(1280px, calc(100% - 48px))',
          marginInline: 'auto',
          marginTop: 48,
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
          © 2026 {company.legalName}. Alle Rechte vorbehalten.
        </span>
        <span>Angebote richten sich ausschließlich an Unternehmen (B2B).</span>
      </div>
    </footer>
  );
}
