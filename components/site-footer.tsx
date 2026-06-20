import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Brand } from "@/components/brand";
import { company, nav, services } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-white/[0.08] bg-black/25">
      <div className="site-container grid gap-12 py-16 lg:grid-cols-[1.3fr_.8fr_.8fr_1fr]">
        <div>
          <Brand />
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/48">AI-gestützte Websites, Shops, Apps und Automatisierungen – persönlich konzipiert, entwickelt und geprüft.</p>
          <p className="mt-6 text-xs uppercase tracking-[0.16em] text-white/28">Ausschließlich B2B</p>
        </div>
        <div>
          <p className="footer-title">Navigation</p>
          <div className="mt-4 grid gap-3">{nav.map((item) => <Link className="footer-link" key={item.href} href={item.href}>{item.label}</Link>)}</div>
        </div>
        <div>
          <p className="footer-title">Leistungen</p>
          <div className="mt-4 grid gap-3">{services.slice(0, 5).map((item) => <Link className="footer-link" key={item.slug} href={`/leistungen/${item.slug}`}>{item.shortTitle}</Link>)}</div>
        </div>
        <div>
          <p className="footer-title">Kontakt</p>
          <div className="mt-4 grid gap-3 text-sm text-white/55">
            <a href={`mailto:${company.email}`} className="footer-contact"><Mail className="size-4" />{company.email}</a>
            <a href={`tel:${company.phoneHref}`} className="footer-contact"><Phone className="size-4" />{company.phone}</a>
            <span className="footer-contact items-start"><MapPin className="mt-0.5 size-4 shrink-0" />{company.address}<br />{company.postalCity}, {company.country}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="site-container flex flex-col gap-5 py-6 text-xs text-white/35 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} {company.legalName}</span>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link><Link href="/agb">AGB</Link><Link href="/ki-hinweise">AI-Hinweise</Link><Link href="/cookie-richtlinie">Cookies</Link><Link href="/avv" className="inline-flex items-center gap-1">AVV <ArrowUpRight className="size-3" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
