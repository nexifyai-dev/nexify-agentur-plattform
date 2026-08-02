// FILE: /apps/website/app/branchen/page.tsx
// NIR: 02.08.2026 11:00
// UPDATED: 02.08.2026 11:00
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Branchen hub — Top high-demand ICPs
// WHY: SEO index + light nav to segmented landings
// BEST-PRACTICE: Rank order from ICP-HIGH-DEMAND-2026
// PITFALL: V-BRANCHE-02: No fake industry statistics on hub
// DEPENDS: lib/content/branchen, lib/seo
// DOCS-REF: docs/gtm/ICP-HIGH-DEMAND-2026.md
// SESSION: icp-demand-competitor-copy-7dd5

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { BRANCHEN } from "@/lib/content/branchen";
import { company } from "@/lib/company";
import { breadcrumbListJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Branchen — KI-Automation für Handwerk, Kanzleien & mehr",
  description:
    "NeXify AI für Handwerk, Steuerberater, Agenturen, E-Commerce und Immobilien. Tagessatz 449 € netto. B2B DACH + NL.",
  path: "/branchen",
  ogTitle: "Branchenlösungen — NeXify AI",
  ogDescription: "Gezielte KI- und Prozess-Automation für die Branchen mit höchster Nachfrage.",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Branchen", path: "/branchen" },
]);

export default function BranchenIndexPage() {
  const sorted = [...BRANCHEN].sort((a, b) => a.rank - b.rank);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <main className="pb-16 pt-28 md:pb-24 md:pt-36" data-testid="branchen-index">
        <div className="site-container max-w-4xl">
          <span className="eyebrow">Branchen · DACH</span>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
            Lösungen dort, wo der Druck am höchsten ist
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400">
            NeXify AI — chat it. Automate it. Für KMU und Partneragenturen ohne klassische
            IT-Tagessätze von oft 1.000–1.500&nbsp;€. Unser Satz: {company.dayRate}&nbsp;€ netto/Tag.
          </p>
          <ul className="mt-12 space-y-4" data-testid="branchen-list">
            {sorted.map((b) => (
              <li key={b.slug}>
                <Link
                  href={`/branchen/${b.slug}`}
                  className="group flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-5 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
                  data-testid={`branchen-card-${b.slug}`}
                >
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                      #{b.rank} · {b.eyebrow.replace("Branche · ", "")}
                    </p>
                    <h2 className="mt-2 font-[family-name:var(--font-heading)] text-xl font-light text-white">{b.title}</h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-500">{b.lead}</p>
                  </div>
                  <ArrowRight className="mt-1 size-5 shrink-0 text-zinc-600 transition-colors group-hover:text-white" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/rueckruf" className="btn-primary inline-flex items-center gap-2" data-testid="branchen-cta-book">
              Rückruf buchen <ArrowRight className="size-4" />
            </Link>
            <Link href="/vergleich" className="btn-ghost inline-flex items-center gap-2" data-testid="branchen-cta-compare">Preisvergleich</Link>
            <Link href="/checkliste" className="btn-ghost inline-flex items-center gap-2" data-testid="branchen-cta-checklist">Checkliste</Link>
          </div>
        </div>
      </main>
    </>
  );
}
