"use client";

import Link from "next/link";
import { ArrowUp, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Brand } from "@/components/brand";
import { company, nav, services } from "@/lib/site-data";
import type { Locale } from "@/lib/i18n";

interface SiteFooterProps {
  currentLocale?: Locale;
}

export function SiteFooter({ currentLocale = "de" }: SiteFooterProps) {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const prefix = `/${currentLocale}`;

  return (
    <footer className="mt-24 border-t border-[var(--border)] bg-[var(--bg-elevated)]">
      <div className="border-b border-[var(--border)]">
        <div className="site-container flex flex-col items-center gap-4 py-10 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <p className="text-[15px] text-[var(--text-2)] font-light">Bereit, Ihr Projekt zu starten?</p>
            <p className="font-mono text-[10px] text-[var(--text-4)] uppercase tracking-[.12em] mt-1">Kostenlose Erstberatung · Antwort in 24h</p>
          </div>
          <Link href={`${prefix}/kontakt`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[var(--r-sm)] bg-[var(--border)] border border-[var(--border-hover)] text-sm text-[var(--text-2)] hover:bg-[var(--border-hover)] hover:text-[var(--text-1)] transition-all">
            Projekt anfragen <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </div>

      <div className="site-container grid gap-12 py-16 lg:grid-cols-[1.3fr_.8fr_.8fr_1fr]">
        <div>
          <Brand />
          <p className="mt-5 max-w-sm text-sm leading-6 text-[var(--text-2)] font-light">AI-gestützte Websites, Shops, Apps und Automatisierungen – persönlich konzipiert, entwickelt und geprüft.</p>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[.16em] text-[var(--text-4)]">Ausschließlich B2B</p>
        </div>
        <div>
          <p className="footer-title">Navigation</p>
          <div className="mt-4 grid gap-3">{nav.map((item) => <Link className="footer-link" key={item.href} href={`${prefix}${item.href}`}>{item.label}</Link>)}</div>
        </div>
        <div>
          <p className="footer-title">Leistungen</p>
          <div className="mt-4 grid gap-3">{services.slice(0, 5).map((item) => <Link className="footer-link" key={item.slug} href={`${prefix}/leistungen/${item.slug}`}>{item.shortTitle}</Link>)}</div>
        </div>
        <div>
          <p className="footer-title">Kontakt</p>
          <div className="mt-4 grid gap-3 text-sm text-[var(--text-2)]">
            <a href={`mailto:${company.email}`} className="footer-contact"><Mail className="size-4" />{company.email}</a>
            <a href={`tel:${company.phoneHref}`} className="footer-contact"><Phone className="size-4" />{company.phone}</a>
            <span className="footer-contact items-start"><MapPin className="mt-0.5 size-4 shrink-0" />{company.address}<br />{company.postalCity}, {company.country}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border)]">
        <div className="site-container flex flex-col gap-5 py-6 font-mono text-[11px] text-[var(--text-4)] md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} {company.legalName}</span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href={`${prefix}/impressum`}>Impressum</Link>
            <Link href={`${prefix}/datenschutz`}>Datenschutz</Link>
            <Link href={`${prefix}/agb`}>AGB</Link>
            <Link href={`${prefix}/ki-hinweise`}>AI-Hinweise</Link>
            <Link href={`${prefix}/cookie-richtlinie`}>Cookies</Link>
            <Link href={`${prefix}/avv`} className="inline-flex items-center gap-1">AVV <ArrowUpRight className="size-3" /></Link>
            <button onClick={scrollTop} className="ml-2 inline-flex items-center gap-1 text-[var(--text-4)] hover:text-[var(--text-2)] transition-colors" aria-label="Nach oben scrollen">
              <ArrowUp className="size-3" /> Oben
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
