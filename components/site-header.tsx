"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { nav } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="site-container flex h-[76px] items-center justify-between gap-5">
        <Brand />
        <nav aria-label="Hauptnavigation" className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.href} href={item.href} className={cn("nav-link", active && "is-active")}>{item.label}</Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <span className="system-chip"><i /> Persönlich geführt</span>
          <Button asChild size="sm"><Link href="/kontakt">Projekt anfragen</Link></Button>
        </div>
        <button type="button" aria-label={open ? "Menü schließen" : "Menü öffnen"} aria-expanded={open} onClick={() => setOpen((v) => !v)} className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.03] lg:hidden">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-white/[0.07] bg-[#0b0d0f]/98 px-5 py-5 lg:hidden">
          <nav className="site-container grid gap-2" aria-label="Mobile Navigation">
            {nav.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-sm text-white/75 hover:bg-white/[0.05] hover:text-white">{item.label}</Link>)}
            <Button asChild className="mt-2"><Link href="/kontakt" onClick={() => setOpen(false)}>Projekt anfragen</Link></Button>
          </nav>
        </div>
      )}
    </header>
  );
}
