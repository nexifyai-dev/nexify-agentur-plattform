// FILE: /apps/website/components/pages/experiences.tsx
// NIR: 08.08.2026
// UPDATED: 08.08.2026
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: /erfahrungen Review-Landingpage — ehrlicher Aufbau OHNE erfundene Zitate:
//       anonymisierte Projekteinblicke (Bestand /referenzen), „Referenzen auf
//       Anfrage“-Block, CTAs zu /audit + /preise + /kontakt. Kein Review-Schema,
//       kein AggregateRating, keine Sterne-Behauptung.
// WHY: M-04 — Suchbegriff „NeXify AI Erfahrungen“; GEGENTEST t_6881891e: die zuvor
//      ausgelieferten 3 Kundenstimmen hatten KEINE dokumentierte Freigabe
//      (docs/gtm/evidence/testimonials/ leer) → entfernt. V-GTM-TRUST-01/02.
// BEST-PRACTICE: Permission-first (docs/gtm/TESTIMONIAL-PERMISSION-PIPELINE_V1.md);
//      Zitate erst wieder einbauen, wenn je Stimme eine Freigabe-Datei in
//      docs/gtm/evidence/testimonials/ liegt. Schema: nur BreadcrumbList.
// PITFALL: V-GTM-TRUST-01/02 — nie AggregateRating/Review-Schema ohne nachweisbare,
//      freigegebene Reviews.
// DEPENDS: lib/content (references.cases), lib/seo, components/reveal,
//          components/json-ld
// DOCS-REF: FREWERT-MARKETING-MASSNAHMENKATALOG-2026-08-08.md M-04
// SESSION: t_6881891e M-04a
"use client";

import Link from "next/link";
import { ArrowRight, TrendingUp, ShieldCheck, MessagesSquare } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { useContent } from "@/lib/content";

export function ExperiencesPage() {
  const t = useContent();
  const cases = t.references.cases;

  return (
    <main className="pb-10 pt-28 md:pt-36" data-testid="experiences-page">
      <div className="site-container">
        <Reveal>
          <span className="eyebrow">Erfahrungen & Ergebnisse</span>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
            Erfahrungen mit NeXify AI
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Keine gekauften Bewertungen, keine erfundenen Zitate. Wir
            veröffentlichen ausschließlich freigegebene Kundenstimmen — und
            bisher ist noch keine öffentliche Bewertung freigegeben. Deshalb
            zeigen wir hier ehrliche Projekteinblicke statt Behauptungen.
          </p>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
            <ShieldCheck size={15} className="text-emerald-400/80" aria-hidden />
            <span className="text-[13px] font-semibold text-zinc-200">
              Referenzen auf Anfrage — keine Fake-Reviews
            </span>
          </div>
        </Reveal>

        <div className="mt-16">
          <Reveal>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-light text-white">
              Projekteinblicke (anonymisiert)
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
              Ausgewählte, anonymisierte Projektergebnisse aus den Bereichen
              Web, Commerce und Automatisierung. Details und passende
              Referenzkontakte vermitteln wir gern im persönlichen Gespräch.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {cases.map((c, i) => (
              <Reveal key={i} delay={i * 100}>
                <article
                  className="glass glass-lift flex h-full flex-col p-8"
                  data-testid={`experience-case-${i}`}
                >
                  <span className="text-xs uppercase tracking-[0.15em] text-amber-300/90">
                    {c.tag}
                  </span>
                  <h3 className="mt-3 font-[family-name:var(--font-heading)] text-lg font-light text-white">
                    {c.title}
                  </h3>
                  <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-zinc-400">
                    {c.text}
                  </p>
                  <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-5">
                    {c.results.map((r) => (
                      <li key={r} className="flex gap-2.5 text-[13.5px] font-medium text-zinc-300">
                        <TrendingUp size={14} className="mt-0.5 shrink-0 text-emerald-400/80" /> {r}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal>
          <div className="mt-14 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <h2 className="flex items-center gap-2 font-[family-name:var(--font-heading)] text-xl font-light text-white">
              <MessagesSquare size={18} className="text-zinc-500" aria-hidden />
              Referenzen auf Anfrage
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
              Wir stellen gern passende Referenzkontakte her — etwa zu Websites
              (Go-Live in drei Arbeitstagen), Commerce-Plattformen mit 60.000+
              Artikeln oder AI-Automatisierung mit spürbar weniger manueller
              Bearbeitungszeit. Schreiben Sie uns kurz, wir vermitteln den
              Kontakt persönlich.
            </p>
            <Link href="/kontakt" className="btn-secondary mt-5" data-testid="experiences-cta-kontakt">
              Referenzgespräch anfragen
            </Link>
          </div>
        </Reveal>

        <div className="mt-8 flex flex-wrap items-center gap-4">
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
          Google oder ProvenExpert. Freigegebene Stimmen veröffentlichen wir
          hier nachvollziehbar, anonymisiert oder mit Namen, wie Sie es wünschen.
        </p>
      </div>
    </main>
  );
}
