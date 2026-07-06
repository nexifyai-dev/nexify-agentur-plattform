"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Brand } from "@/components/brand";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Button } from "@/components/ui/button";
import { nav } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";

interface SiteHeaderProps {
  currentLocale?: Locale;
}

export function SiteHeader({ currentLocale = "de" }: SiteHeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const prevPath = useRef(pathname);
  useEffect(() => {
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      setOpen(false);
    }
  }, [pathname]);

  const prefix = `/${currentLocale}`;

  return (
    <header className={cn("site-header transition-all duration-300", scrolled && "shadow-[0_1px_0_rgba(255,255,255,.04)]")}>
      <div className="site-container flex h-[72px] items-center justify-between gap-6">
        <Brand />
        <nav aria-label="Hauptnavigation" className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => {
            const href = `${prefix}${item.href}`;
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link key={item.href} href={href} className={cn("nav-link", active && "is-active")}>{item.label}</Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
          <LocaleSwitcher currentLocale={currentLocale} />
          <span className="system-chip"><i /> Persönlich geführt</span>
          <Button asChild size="sm"><Link href={`${prefix}/kontakt`}>Projekt anfragen <ArrowRight className="size-3" /></Link></Button>
        </div>
        <button
          type="button"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid size-9 place-items-center rounded-[var(--r-sm)] border border-[var(--border)] bg-[var(--bg-surface)] transition-colors hover:bg-[var(--border)] lg:hidden"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 lg:hidden",
          open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="border-t border-[var(--border)] bg-[var(--bg-page)]/98 px-5 py-5">
          <div className="site-container mb-3">
            <LocaleSwitcher currentLocale={currentLocale} />
          </div>
          <nav className="site-container grid gap-1" aria-label="Mobile Navigation">
            {nav.map((item) => {
              const href = `${prefix}${item.href}`;
              const active = pathname === href;
              return (
                <Link
                  key={item.href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-[8px] px-4 py-3 text-sm transition-colors",
                    active ? "bg-[var(--border)] text-[var(--text-1)]" : "text-[var(--text-3)] hover:bg-[var(--border)] hover:text-[var(--text-2)]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Button asChild className="mt-3"><Link href={`${prefix}/kontakt`} onClick={() => setOpen(false)}>Projekt anfragen <ArrowRight className="size-3" /></Link></Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
