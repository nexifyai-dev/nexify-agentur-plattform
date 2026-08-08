// FILE: /apps/website/components/sections/references-section.tsx
// NIR: 08.08.2026
// UPDATED: 08.08.2026
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Home-Sektion „Referenzen & Ergebnisse“ — ehrliche Projekteinblicke statt
//       erfundener Kundenstimmen. CTAs zu /referenzen + /erfahrungen.
// WHY: t_6881891e GEGENTEST — Kundenstimmen hatten keine dokumentierte Freigabe
//       (docs/gtm/evidence/testimonials/ leer) → Zitate entfernt (V-GTM-TRUST-01/02).
// BEST-PRACTICE: Permission-first; Zitate erst nach dokumentierter Freigabe wieder
//       einbauen (TESTIMONIAL-PERMISSION-PIPELINE_V1.md).
// DEPENDS: lib/content (home.quotesText), components/reveal
// SESSION: t_6881891e M-04a
'use client';

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { useContent } from "@/lib/content";

export function ReferencesSection() {
  const t = useContent();

  return (
    <section className="py-12 md:py-16">
      <div className="site-container">
        <Reveal>
          <span className="eyebrow">{t.home.quotesEyebrow}</span>
          <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-light tracking-tight text-white sm:text-4xl">{t.home.quotesTitle}</h2>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-zinc-400">{t.home.quotesText}</p>
        </Reveal>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link href="/referenzen" className="btn-primary" data-testid="references-section-cta-referenzen">
            Projektergebnisse ansehen <ArrowRight size={14} className="ml-1 inline" />
          </Link>
          <Link href="/erfahrungen" className="btn-secondary" data-testid="references-section-cta-erfahrungen">
            Erfahrungen & Referenzen auf Anfrage
          </Link>
        </div>
      </div>
    </section>
  );
}
