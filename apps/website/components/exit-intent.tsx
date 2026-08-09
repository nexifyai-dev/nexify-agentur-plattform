// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/components/exit-intent.tsx
// NIR: 02.08.2026 10:40
// UPDATED: 02.08.2026 10:40
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Desktop exit-intent modal → /rueckruf or /checkliste (once per session)
// WHY: Zero-cost conversion (#208); sticky CTA alone misses desktop leave intent
// BEST-PRACTICE: Respect prefers-reduced-motion; sessionStorage gate; no fake countdown
// PITFALL: V-GTM-EI-01: Never fire on mobile touch; skip legal/booking paths
// DEPENDS: next/link, useLang, usePathname
// DOCS-REF: docs/gtm/ONGOING-GAP-AND-ACQUISITION-RADAR.md A09
// SESSION: open-issues-16-close-7dd5

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { useLang } from "@/lib/lang-context";

const SESSION_KEY = "nexify-exit-intent-shown";

const SKIP_PREFIXES = [
  "/rueckruf",
  "/kontakt",
  "/checkliste",
  "/login",
  "/registrieren",
  "/konto",
  "/admin",
  "/impressum",
  "/datenschutz",
  "/agb",
  "/cookie",
];

const COPY = {
  de: {
    title: "Kurz sprechen — ohne Sales-Call?",
    body: "15-Minuten-Rückruf oder kostenfreie Checkliste. Kein Newsletter-Zwang.",
    primary: "Termin buchen",
    secondary: "Checkliste holen",
    dismiss: "Schließen",
  },
  en: {
    title: "Quick chat — no sales pitch?",
    body: "Book a 15-minute callback or grab the free checklist. No newsletter push.",
    primary: "Book a call",
    secondary: "Get checklist",
    dismiss: "Close",
  },
  nl: {
    title: "Kort sparren — zonder salespitch?",
    body: "Boek een terugbelafspraak of download de gratis checklist. Geen nieuwsbriefdwang.",
    primary: "Gesprek boeken",
    secondary: "Checklist ophalen",
    dismiss: "Sluiten",
  },
} as const;

export function ExitIntent() {
  const { lang } = useLang();
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const t = COPY[lang === "en" || lang === "nl" ? lang : "de"];

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.innerWidth < 1024) return;
    if (SKIP_PREFIXES.some((p) => pathname.startsWith(p))) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") return;
    } catch {
      return;
    }

    const onLeave = (e: MouseEvent) => {
      if (e.clientY > 12) return;
      try {
        if (sessionStorage.getItem(SESSION_KEY) === "1") return;
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        return;
      }
      setOpen(true);
      window.removeEventListener("mouseout", onLeave);
    };

    window.addEventListener("mouseout", onLeave);
    return () => window.removeEventListener("mouseout", onLeave);
  }, [pathname]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
      data-testid="exit-intent-modal"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-white/12 bg-[#0A0A0A] p-6 shadow-[0_24px_80px_rgba(0,0,0,.65)] md:p-8">
        <button
          type="button"
          className="absolute right-3 top-3 rounded-full p-2 text-zinc-500 hover:bg-white/5 hover:text-white"
          onClick={() => setOpen(false)}
          aria-label={t.dismiss}
          data-testid="exit-intent-dismiss"
        >
          <X className="size-4" />
        </button>
        <h2
          id="exit-intent-title"
          className="pr-8 font-[family-name:var(--font-heading)] text-2xl font-light tracking-tight text-white"
        >
          {t.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">{t.body}</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/rueckruf?utm_source=exit-intent&utm_medium=organic&utm_campaign=exit-intent_rueckruf"
            className="btn-primary inline-flex flex-1 items-center justify-center gap-2 !px-5 !py-3 !text-[13px]"
            data-testid="exit-intent-primary"
            onClick={() => setOpen(false)}
          >
            {t.primary}
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/checkliste?utm_source=exit-intent&utm_medium=organic&utm_campaign=exit-intent_checkliste"
            className="inline-flex flex-1 items-center justify-center rounded-full border border-white/20 px-5 py-3 text-[13px] font-medium text-white hover:bg-white/5"
            data-testid="exit-intent-secondary"
            onClick={() => setOpen(false)}
          >
            {t.secondary}
          </Link>
        </div>
      </div>
    </div>
  );
}
