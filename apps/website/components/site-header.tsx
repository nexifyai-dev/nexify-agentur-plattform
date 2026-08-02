"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, UserRound } from "lucide-react";
import { Logo } from "@/components/logo";
import { useLang } from "@/lib/lang-context";
import { useAuth } from "@/lib/auth";

const NAV = {
  de: [
    { label: "Leistungen", href: "/leistungen" },
    { label: "Preise", href: "/preise" },
    { label: "Prozess", href: "/prozess" },
    { label: "Vergleich", href: "/vergleich" },
    { label: "Referenzen", href: "/referenzen" },
    { label: "Wissen", href: "/wissen" },
    { label: "Über mich", href: "/ueber-mich" },
  ],
  en: [
    { label: "Services", href: "/leistungen" },
    { label: "Pricing", href: "/preise" },
    { label: "Process", href: "/prozess" },
    { label: "Compare", href: "/vergleich" },
    { label: "References", href: "/referenzen" },
    { label: "Knowledge", href: "/wissen" },
    { label: "About", href: "/ueber-mich" },
  ],
  nl: [
    { label: "Diensten", href: "/leistungen" },
    { label: "Prijzen", href: "/preise" },
    { label: "Proces", href: "/prozess" },
    { label: "Vergelijk", href: "/vergleich" },
    { label: "Referenties", href: "/referenzen" },
    { label: "Kennis", href: "/wissen" },
    { label: "Over mij", href: "/ueber-mich" },
  ],
};


export function SiteHeader() {
  const { lang, setLang } = useLang();
  const { user } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close menus on route change
    setOpen(false);
  }, [pathname]);


  return (
    <header
      className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled ? "border-white/10 bg-black/70 backdrop-blur-2xl" : "border-transparent bg-transparent"
      }`}
      data-testid="site-header"
    >
      <div className="site-container flex h-[64px] items-center justify-between gap-2 sm:h-[74px] sm:gap-4">
        <Link href="/" aria-label="NeXify AI – Startseite" data-testid="header-logo-link" className="min-w-0 shrink">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" data-testid="header-nav">
          {NAV[lang].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-testid={`nav-link-${item.href.slice(1)}`}
              className={`text-[13px] font-medium transition-colors ${
                pathname === item.href ? "text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
          </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <div className="flex items-center rounded-full border border-white/12 p-0.5 sm:p-1" data-testid="lang-switcher">
            {(["de", "en", "nl"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                data-testid={`lang-switcher-${l}`}
                className={`min-h-9 min-w-9 rounded-full px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all sm:min-h-0 sm:min-w-0 sm:px-3 ${
                  lang === l ? "bg-white text-black shadow-[0_0_14px_rgba(255,255,255,0.25)]" : "text-zinc-400 hover:text-white"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <Link
            href={user && typeof user === "object" ? (user.role === "admin" ? "/admin" : "/konto") : "/login"}
            className="inline-flex size-11 items-center justify-center rounded-full border border-white/12 text-zinc-300 transition-colors hover:border-white/30 hover:text-white sm:size-10"
            aria-label={lang === "de" ? "Konto" : "Account"}
            data-testid="header-account-link"
          >
            <UserRound size={16} />
          </Link>

          <Link
            href="/rueckruf"
            className="btn-ghost hidden !px-4 !py-2.5 !text-[13px] lg:inline-flex"
            data-testid="header-booking-cta"
          >
            {lang === "en" ? "Book call" : lang === "nl" ? "Gesprek boeken" : "Termin buchen"}
          </Link>
          <Link href="/kontakt" className="btn-primary hidden md:inline-flex !px-6 !py-2.5 !text-[13px]" data-testid="header-cta">
            {lang === "en" ? "Start project" : lang === "nl" ? "Project starten" : "Projekt starten"}
          </Link>

          <button
            className="inline-flex size-11 items-center justify-center rounded-full border border-white/12 text-white sm:size-10 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={open}
            aria-controls="mobile-nav-menu"
            data-testid="mobile-menu-toggle"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav-menu" className="max-h-[min(80vh,calc(100dvh-64px))] overflow-y-auto border-t border-white/10 bg-black/90 backdrop-blur-2xl lg:hidden" data-testid="mobile-menu" role="dialog" aria-label="Navigation">
          <nav className="site-container flex flex-col gap-1 py-4" aria-label="Mobile">
            {NAV[lang].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-3.5 text-base font-medium ${pathname === item.href ? "bg-white/5 text-white" : "text-zinc-400"}`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/kontakt" className="btn-primary mt-2 min-h-12 justify-center">
              {lang === "en" ? "Start project" : lang === "nl" ? "Project starten" : "Projekt starten"}
            </Link>
            <Link href="/rueckruf" className="btn-ghost mt-1 min-h-12 justify-center !text-sm">
              {lang === "en" ? "Book callback" : lang === "nl" ? "Terugbelafspraak" : "Rückruf buchen"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
