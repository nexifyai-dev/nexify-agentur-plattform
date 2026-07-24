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
    { label: "Plattform", href: "/plattform" },
    { label: "Referenzen", href: "/referenzen" },
    { label: "Wissen", href: "/wissen" },
    { label: "Über mich", href: "/ueber-mich" },
    { label: "Rückruf", href: "/rueckruf" },
  ],
  en: [
    { label: "Services", href: "/leistungen" },
    { label: "Pricing", href: "/preise" },
    { label: "Process", href: "/prozess" },
    { label: "Platform", href: "/plattform" },
    { label: "References", href: "/referenzen" },
    { label: "Knowledge", href: "/wissen" },
    { label: "About", href: "/ueber-mich" },
    { label: "Callback", href: "/rueckruf" },
  ],
  nl: [
    { label: "Diensten", href: "/leistungen" },
    { label: "Prijzen", href: "/preise" },
    { label: "Proces", href: "/prozess" },
    { label: "Platform", href: "/plattform" },
    { label: "Referenties", href: "/referenzen" },
    { label: "Kennis", href: "/wissen" },
    { label: "Over mij", href: "/ueber-mich" },
    { label: "Terugbellen", href: "/rueckruf" },
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

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled ? "border-white/10 bg-black/70 backdrop-blur-2xl" : "border-transparent bg-transparent"
      }`}
      data-testid="site-header"
    >
      <div className="site-container flex h-[74px] items-center justify-between gap-4">
        <Link href="/" aria-label="NeXify AI – Startseite" data-testid="header-logo-link">
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

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-white/12 p-1" data-testid="lang-switcher">
            {(["de", "en", "nl"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                data-testid={`lang-switcher-${l}`}
                className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
                  lang === l ? "bg-white text-black shadow-[0_0_14px_rgba(255,255,255,0.25)]" : "text-zinc-400 hover:text-white"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <Link
            href={user && typeof user === "object" ? (user.role === "admin" ? "/admin" : "/konto") : "/login"}
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/12 text-zinc-300 transition-colors hover:border-white/30 hover:text-white"
            aria-label={lang === "de" ? "Konto" : "Account"}
            data-testid="header-account-link"
          >
            <UserRound size={16} />
          </Link>

          <Link href="/kontakt" className="btn-primary !hidden !px-6 !py-2.5 !text-[13px] md:!inline-flex" data-testid="header-cta">
            {lang === "en" ? "Start project" : lang === "nl" ? "Project starten" : "Projekt starten"}
          </Link>

          <button
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/12 text-white lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menü"
            data-testid="mobile-menu-toggle"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-black/90 backdrop-blur-2xl lg:hidden" data-testid="mobile-menu">
          <nav className="site-container flex flex-col gap-1 py-4">
            {NAV[lang].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-3 text-sm font-medium ${pathname === item.href ? "bg-white/5 text-white" : "text-zinc-400"}`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/kontakt" className="btn-primary mt-2 justify-center">
              {lang === "en" ? "Start project" : lang === "nl" ? "Project starten" : "Projekt starten"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
