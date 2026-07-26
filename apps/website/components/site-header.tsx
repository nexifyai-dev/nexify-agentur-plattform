"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, UserRound, ChevronDown } from "lucide-react";
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

const APPS_MENU = {
  de: {
    label: "Tools",
    items: [
      {
        label: "Hermes Agent",
        href: process.env.NEXT_PUBLIC_HERMES_URL ?? "/plattform#hermes",
        description: "Persistenter KI-Agent – selbst gehostet",
        external: true,
      },
      {
        label: "Kundenkonto",
        href: "/konto",
        description: "Projekte, Angebote & Tickets",
        external: false,
      },
      {
        label: "Admin-Portal",
        href: "/admin",
        description: "Interne Verwaltungsoberfläche",
        external: false,
      },
    ],
  },
  en: {
    label: "Tools",
    items: [
      {
        label: "Hermes Agent",
        href: process.env.NEXT_PUBLIC_HERMES_URL ?? "/plattform#hermes",
        description: "Persistent AI agent – self-hosted",
        external: true,
      },
      {
        label: "Client Account",
        href: "/konto",
        description: "Projects, offers & tickets",
        external: false,
      },
      {
        label: "Admin Portal",
        href: "/admin",
        description: "Internal management interface",
        external: false,
      },
    ],
  },
  nl: {
    label: "Tools",
    items: [
      {
        label: "Hermes Agent",
        href: process.env.NEXT_PUBLIC_HERMES_URL ?? "/plattform#hermes",
        description: "Persistente AI-agent – zelf gehost",
        external: true,
      },
      {
        label: "Klantaccount",
        href: "/konto",
        description: "Projecten, offertes & tickets",
        external: false,
      },
      {
        label: "Adminportaal",
        href: "/admin",
        description: "Interne beheerinterface",
        external: false,
      },
    ],
  },
};

export function SiteHeader() {
  const { lang, setLang } = useLang();
  const { user } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const appsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

<<<<<<< HEAD
  useEffect(() => { setOpen(false); setAppsOpen(false); }, [pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (appsRef.current && !appsRef.current.contains(e.target as Node)) {
        setAppsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const appsMenu = APPS_MENU[lang];
=======
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close mobile menu on route change
    setOpen(false);
  }, [pathname]);
>>>>>>> origin/main

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

          {/* Apps / Tools dropdown */}
          <div className="relative" ref={appsRef} data-testid="nav-apps-dropdown">
            <button
              onClick={() => setAppsOpen((v) => !v)}
              aria-expanded={appsOpen}
              aria-haspopup="true"
              data-testid="nav-apps-toggle"
              className={`flex items-center gap-1 text-[13px] font-medium transition-colors ${
                appsOpen ? "text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              {appsMenu.label}
              <ChevronDown
                size={13}
                className={`transition-transform duration-200 ${appsOpen ? "rotate-180" : ""}`}
              />
            </button>

            {appsOpen && (
              <div
                className="absolute right-0 top-[calc(100%+12px)] w-[260px] rounded-2xl border border-white/10 bg-black/90 py-2 shadow-2xl backdrop-blur-2xl"
                data-testid="nav-apps-menu"
              >
                {appsMenu.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    data-testid={`nav-apps-item-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex flex-col gap-0.5 px-4 py-3 transition-colors hover:bg-white/5"
                    onClick={() => setAppsOpen(false)}
                  >
                    <span className="text-[13px] font-medium text-white">{item.label}</span>
                    <span className="text-[11.5px] text-zinc-500">{item.description}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
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
            {/* Apps / Tools section in mobile menu */}
            <div className="mt-1 border-t border-white/8 pt-2" data-testid="mobile-apps-section">
              <p className="px-4 pb-1 pt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                {appsMenu.label}
              </p>
              {appsMenu.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="flex flex-col gap-0.5 rounded-xl px-4 py-2.5 text-zinc-400 transition-colors hover:bg-white/5"
                >
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-[11px] text-zinc-600">{item.description}</span>
                </Link>
              ))}
            </div>
            <Link href="/kontakt" className="btn-primary mt-2 justify-center">
              {lang === "en" ? "Start project" : lang === "nl" ? "Project starten" : "Projekt starten"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

