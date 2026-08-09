// FILE: /apps/website/app/branchen/page.tsx
// NIR: 02.08.2026 10:50
// UPDATED: 02.08.2026 10:50
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Branchen hub — SEO index of ICP industry landings
// WHY: Competitor industry-page pattern adapted for NeXify
// BEST-PRACTICE: Light nav link; honest pains; CTA to audit/sprechstunde
// PITFALL: V-GTM-BR-02: No fake industry stats
// DEPENDS: lib/gtm/branchen
// DOCS-REF: docs/gtm/STRONGEST-COMPETITORS-2026.md
// SESSION: strongest-competitors-tactics-7dd5

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { branchen } from "@/lib/gtm/branchen";
import { breadcrumbListJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Branchen — KI & Automatisierung für KMU",
  description:
    "Branchenseiten für Handwerk, Steuerberatung, E-Commerce, Immobilien und Agentur-Partner — mit Audit- und Pilot-Pfad zum Tagessatz 449 €.",
  path: "/branchen",
  ogTitle: "Branchen | NeXify AI",
  ogDescription: "ICP-Landings ohne Fake-Claims — klarer Einstieg über Audit oder Rückruf.",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Branchen", path: "/branchen" },
]);

export default function BranchenHubPage() {
  return (
    <>
      <main className="pb-16 pt-28 md:pb-24 md:pt-36" data-testid="branchen-hub">
        <div className="site-container max-w-4xl">
          <span className="eyebrow">Zielgruppen · SEO</span>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
            Branchen, in denen Tempo zählt
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-400">
            Keine Universalversprechen. Jede Seite beschreibt typische Engpässe und einen klaren
            Einstieg: Sprechstunde, Audit oder Partner-Gespräch.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2" data-testid="branchen-grid">
            {branchen.map((b) => (
              <Link
                key={b.slug}
                href={`/branchen/${b.slug}`}
                className="glass glass-lift group block p-6 transition-colors hover:border-white/20"
                data-testid={`branche-card-${b.slug}`}
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                  {b.eyebrow}
                </span>
                <h2 className="mt-3 font-[family-name:var(--font-heading)] text-xl font-medium text-white group-hover:text-zinc-100">
                  {b.title.split("—")[0].trim()}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm text-zinc-500">{b.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-zinc-300">
                  Öffnen <ArrowRight className="size-3.5" />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/audit" className="btn-primary" data-testid="branchen-to-audit">
              Zum Audit
            </Link>
            <Link href="/preise" className="btn-ghost" data-testid="branchen-to-preise">
              Pakete & Preise
            </Link>
            <Link href="/leistungen" className="btn-ghost" data-testid="branchen-to-leistungen">
              Leistungen
            </Link>
          </div>
        </div>
      </main>
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
