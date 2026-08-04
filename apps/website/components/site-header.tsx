'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLang } from '@/lib/lang-context';

/** Anhang-Logo (SVG NX-Mark + Lime-Punkt + Wortmarke), exakt nach "NeXify Homepage.dc.html". */
export function NxLogoMark() {
  return (
    <span
      className="relative flex items-center justify-center size-[34px] rounded-[10px] flex-none"
      style={{
        background: 'linear-gradient(155deg,#18181c,#0a0a0c)',
        border: '1px solid rgba(255,255,255,0.1)',
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
        className="absolute -top-[3px] -right-[3px] size-[9px] rounded-full"
        style={{
          background: '#C8FF00',
          boxShadow: '0 0 8px rgba(200,255,0,0.75), 0 0 0 3px #0A0A0A',
        }}
      />
    </span>
  );
}

const NAV = [
  { label: "Leistungen", href: "/leistungen" },
  { label: "Preise", href: "/preise" },
  { label: "Prozess", href: "/prozess" },
  { label: "Referenzen", href: "/referenzen" },
  { label: "Über uns", href: "/ueberuns" },
  { label: "FAQ", href: "/faq" },
];

export function SiteHeader() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(10,10,10,0.72)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="mx-auto flex items-center justify-between h-[64px] sm:h-[74px] gap-4 flex-nowrap px-6 max-w-[1280px]">
        <Link
          href="/"
          data-testid="header-logo-link"
          className="flex items-center gap-[11px] shrink-0 no-underline"
        >
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

        <nav
          data-testid="header-nav"
          className="hidden xl:flex items-center gap-[22px] whitespace-nowrap"
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[13px] text-[#a1a1aa] font-medium no-underline hover:text-white transition-colors"
              data-testid={`nav-link-${item.href.slice(1)}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-[14px] flex-none">
          <div
            className="flex items-center gap-[2px] rounded-full p-[3px]"
            style={{ border: '1px solid rgba(255,255,255,0.12)' }}
            data-testid="lang-switcher"
          >
            {(['de', 'nl'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                data-testid={`lang-switcher-${l}`}
                className="rounded-full px-[10px] py-[5px] text-[11px] font-bold uppercase cursor-pointer border-none"
                style={{
                  background: lang === l ? 'rgba(200,255,0,0.15)' : 'transparent',
                  color: lang === l ? '#C8FF00' : '#71717a',
                }}
              >
                {l}
              </button>
            ))}
          </div>

          <Link
            href="/rueckruf"
            data-testid="header-cta"
            className="hidden xl:inline-flex items-center gap-2 rounded-full px-5 py-[11px] text-[12.5px] font-bold whitespace-nowrap flex-none no-underline"
            style={{
              background: 'linear-gradient(120deg,#C8FF00,#e9ff8a 45%,#C8FF00)',
              color: '#0A0A0A',
              boxShadow: '0 0 22px rgba(200,255,0,0.25)',
            }}
          >
            Gespräch buchen
          </Link>

          <button
            className="size-11 flex items-center justify-center rounded-[10px] cursor-pointer border border-white/15 bg-transparent flex-col gap-1 xl:hidden"
            onClick={() => setOpen((s) => !s)}
            data-testid="mobile-menu-toggle"
            aria-label="Menü öffnen"
            aria-expanded={open}
          >
            <span className="sr-only">Menü öffnen</span>
            <span className="block w-4 h-[1.5px] bg-[#e5e5e5]" />
            <span className="block w-4 h-[1.5px] bg-[#e5e5e5]" />
            <span className="block w-4 h-[1.5px] bg-[#e5e5e5]" />
          </button>
        </div>
      </div>

      <div
        data-testid="mobile-menu"
        className="overflow-y-auto max-h-[min(80vh,600px)] flex-col px-6 pb-5 pt-3 xl:hidden"
        style={{
          display: open ? 'flex' : 'none',
          background: 'rgba(10,10,10,0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className="py-[14px] text-[15px] text-[#e5e5e5] font-medium no-underline"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/rueckruf"
          onClick={() => setOpen(false)}
          className="mt-4 inline-flex items-center justify-center rounded-full px-5 py-3 text-[13px] font-bold no-underline"
          style={{
            background: 'linear-gradient(120deg,#C8FF00,#e9ff8a 45%,#C8FF00)',
            color: '#0A0A0A',
          }}
        >
          Gespräch buchen
        </Link>
      </div>
    </header>
  );
}
