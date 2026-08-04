'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLang } from '@/lib/lang-context';

/** Anhang-Logo (SVG NX-Mark + Lime-Punkt + Wortmarke), exakt nach "NeXify Homepage.dc.html". */
export function NxLogoMark() {
  return (
    <span
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 34,
        height: 34,
        borderRadius: 10,
        background: 'linear-gradient(155deg,#18181c,#0a0a0c)',
        border: '1px solid rgba(255,255,255,0.1)',
        flex: 'none',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 34 34" fill="none">
        <defs>
          <linearGradient id="nxLogoGrad" x1="6" y1="28" x2="28" y2="6" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#d4d4d8" />
            <stop offset="1" stopColor="#fafafa" />
          </linearGradient>
        </defs>
        <rect x="6" y="6" width="4.4" height="22" rx="1" fill="url(#nxLogoGrad)" />
        <rect x="23.6" y="6" width="4.4" height="22" rx="1" fill="url(#nxLogoGrad)" />
        <polygon points="6,6 11.5,6 28,28 22.5,28" fill="url(#nxLogoGrad)" />
      </svg>
      <span
        style={{
          position: 'absolute',
          top: -3,
          right: -3,
          width: 9,
          height: 9,
          borderRadius: 999,
          background: '#C8FF00',
          boxShadow: '0 0 8px rgba(200,255,0,0.75), 0 0 0 3px #0A0A0A',
        }}
      />
    </span>
  );
}

const NAV = [
  { label: 'Leistungen', href: '#leistungen' },
  { label: 'Preise', href: '#preise' },
  { label: 'Prozess', href: '#prozess' },
  { label: 'Referenzen', href: '#referenzen' },
  { label: 'Über uns', href: '#ueberuns' },
  { label: 'FAQ', href: '#faq' },
];

export function SiteHeader() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);

  const anchor = (h: string) => `/${lang}${h}`;

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(10,10,10,0.72)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div
        style={{
          width: 'min(1280px, calc(100% - 48px))',
          marginInline: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 76,
          gap: 16,
          flexWrap: 'nowrap',
        }}
      >
        <Link href={anchor('#top')} style={{ display: 'flex', alignItems: 'center', gap: 11, flex: 'none' }} data-testid="logo">
          <NxLogoMark />
          <span
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 600,
              fontSize: 17,
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
            }}
          >
            NeXify <span style={{ fontWeight: 300, color: '#9E9E9E' }}>AI</span>
          </span>
        </Link>

        <nav className="nx-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 22, whiteSpace: 'nowrap' }}>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={anchor(item.href)}
              style={{ fontSize: 13, color: '#a1a1aa', fontWeight: 500 }}
              data-testid={`nav-${item.href.slice(1)}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 'none' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.12)',
              padding: 3,
            }}
            data-testid="lang-switcher"
          >
            {(['de', 'nl'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                data-testid={`lang-switcher-${l}`}
                style={{
                  border: 'none',
                  background: lang === l ? 'rgba(200,255,0,0.15)' : 'transparent',
                  color: lang === l ? '#C8FF00' : '#71717a',
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  borderRadius: 999,
                  padding: '5px 10px',
                  cursor: 'pointer',
                }}
              >
                {l}
              </button>
            ))}
          </div>

          <Link
            href={anchor('#kontakt')}
            data-testid="header-cta"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              borderRadius: 999,
              padding: '11px 20px',
              background: 'linear-gradient(120deg,#C8FF00,#e9ff8a 45%,#C8FF00)',
              color: '#0A0A0A',
              fontWeight: 700,
              fontSize: 12.5,
              whiteSpace: 'nowrap',
              boxShadow: '0 0 22px rgba(200,255,0,0.25)',
              flex: 'none',
            }}
          >
            Gespräch buchen
          </Link>

          <span
            className="nx-mobile-toggle"
            onClick={() => setOpen((s) => !s)}
            data-testid="mobile-nav-toggle"
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.15)',
              cursor: 'pointer',
              flex: 'none',
              gap: 4,
              flexDirection: 'column',
            }}
          >
            <span style={{ width: 16, height: 1.5, background: '#e5e5e5' }} />
            <span style={{ width: 16, height: 1.5, background: '#e5e5e5' }} />
            <span style={{ width: 16, height: 1.5, background: '#e5e5e5' }} />
          </span>
        </div>
      </div>

      {open && (
        <div
          data-testid="mobile-nav-menu"
          style={{
            position: 'absolute',
            top: 76,
            left: 0,
            right: 0,
            background: 'rgba(10,10,10,0.97)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            padding: '12px 24px 20px',
          }}
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={anchor(item.href)}
              onClick={() => setOpen(false)}
              style={{
                padding: '14px 0',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                fontSize: 15,
                color: '#e5e5e5',
                fontWeight: 500,
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
