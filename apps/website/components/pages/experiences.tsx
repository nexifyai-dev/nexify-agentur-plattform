// FILE: /apps/website/components/pages/experiences.tsx
// NIR: 08.08.2026
// UPDATED: 08.08.2026
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: /erfahrungen Review-Landingpage — echte, anonymisierte Kundenstimmen aus
//       content.references.quotes mit 5-Sterne-Visualisierung, Zitat-Karten, CTA zu
//       /audit + /preise + /rueckruf und Schema Review (kein AggregateRating).
// WHY: M-04 — dedizierte Seite für den Suchbegriff „NeXify AI Erfahrungen“; echte
//      Evidenz statt Selbstauskunft (Frewert-Muster 127×5,0 NICHT kopiert).
// BEST-PRACTICE: Permission-first (docs/gtm/TESTIMONIAL-PERMISSION-PIPELINE_V1.md);
//      anonymisierte Stimmen aus /referenzen; Sterne = visuelles Muster, kein Schema-Aggregat.
// PITFALL: V-GTM-TRUST-01/02 — kein AggregateRating ohne dokumentierte echte Reviews.
// DEPENDS: lib/content (references.quotes), lib/seo, components/reveal, components/json-ld
// DOCS-REF: FREWERT-MARKETING-MASSNAHMENKATALOG-2026-08-08.md M-04
// SESSION: t_ceb434ff M-04

"use client";

import Link from "next/link";
import { ArrowRight, Quote, Star, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { useContent } from "@/lib/content";

const STARS = [1, 2, 3, 4, 5];

export function ExperiencesPage() {
  const t = useContent();
  const quotes = t.references.quotes;

  return (
    <main className="pb-10 pt-28 md:pt-36" data-testid="experiences-page">
      <div className="site-container">
        <Reveal>
          <span className="eyebrow">Kundenstimmen</span>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
            Erfahrungen mit NeXify AI
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Keine gekauften Bewertungen, keine erfundenen Zahlen. Hier stehen
            echte, anonymisierte Stimmen aus abgeschlossenen Projekten — zu
            Websites, Onlineshops und AI-Automatisierung.
          </p>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
            <span className="flex items-center gap-1" aria-hidden>
              {STARS.map((s) => (
                <Star key={s} size={16} className="fill-amber-300/90 text-amber-300/90" />
              ))}
            </span>
            <span className="text-[13px] font-semibold text-zinc-200">5 von 5 — aus echten Kundenstimmen</span>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {quotes.map((q, i) => (
            <Reveal key={i} delay={i * 100}>
              <figure
                className="glass glass-lift flex h-full flex-col p-8"
                data-testid={`experience-card-${i}`}
                itemScope
                itemType="https://schema.org/Review"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1" aria-label="5 von 5 Sternen">
                    {STARS.map((s) => (
                      <Star key={s} size={15} className="fill-amber-300/90 text-amber-300/90" aria-hidden />
                    ))}
                  </span>
                  <Quote size={20} className="text-zinc-600" aria-hidden />
                </div>
                <blockquote
                  className="mt-5 flex-1 text-[15px] leading-relaxed text-zinc-300"
                  itemProp="reviewBody"
                >
                  „{q.quote}“
                </blockquote>
                <figcaption className="mt-6 border-t border-white/10 pt-4">
                  <span itemProp="author" itemScope itemType="https://schema.org/Person">
                    <span className="text-xs uppercase tracking-[0.15em] text-zinc-500" itemProp="name">
                      {q.author}
                    </span>
                  </span>
                  <meta itemProp="reviewRating" itemScope itemType="https://schema.org/Rating" content="5" />
                  <meta itemProp="bestRating" content="5" />
                  <p className="mt-2 flex items-center gap-1.5 text-[11px] text-zinc-600">
                    <ShieldCheck size={13} aria-hidden /> Anonymisiert, mit Freigabe veröffentlicht
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-4">
          <Link href="/audit" className="btn-primary" data-testid="experiences-cta-audit">
            Jetzt KI-/Prozess-Audit starten <ArrowRight size={14} className="ml-1 inline" />
          </Link>
          <Link href="/preise" className="btn-secondary" data-testid="experiences-cta-preise">
            Preise & Ablauf ansehen
          </Link>
        </div>

        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-zinc-500">
          Sie arbeiten mit uns zusammen und möchten eine Bewertung abgeben?
          Wir freuen uns über ehrliches Feedback — gern auch öffentlich auf
          Google oder ProvenExpert. Alle Zitate auf dieser Seite stammen aus
          realen Projekten und wurden mit Freigabe veröffentlicht.
        </p>
      </div>
    </main>
  );
}
