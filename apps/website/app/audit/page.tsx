// FILE: /apps/website/app/audit/page.tsx
// NIR: 02.08.2026 10:50
// UPDATED: 02.08.2026 10:50
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Paid productized audit landing — competitor-proven entry offer
// WHY: Paid audit filters willingness-to-pay better than free sales calls alone
// BEST-PRACTICE: Deliverable ownership; credit path to pilot; no fake ROI
// PITFALL: V-GTM-AUDIT-01: Do not claim BAFA certification we don't have
// DEPENDS: productized-offers, company, /rueckruf
// DOCS-REF: docs/gtm/STRONGEST-COMPETITORS-2026.md
// SESSION: strongest-competitors-tactics-7dd5

import Link from "next/link";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { company } from "@/lib/company";
import { productizedOffers } from "@/lib/gtm/productized-offers";
import { breadcrumbListJsonLd, pageMetadata } from "@/lib/seo";

const audit = productizedOffers.find((o) => o.id === "audit")!;

export const metadata = pageMetadata({
  title: `KI-/Prozess-Audit — ${audit.priceNet} € netto (1 Tag) | NeXify AI`,
  description:
    "1-Tages-Audit zum Tagessatz: schriftliche Prioritäten, Top-Hebel, Festpreis-Empfehlung für einen Pilot. Kein Folien-Theater — B2B DACH + NL.",
  path: "/audit",
  ogTitle: "KI-/Prozess-Audit — 449 € netto",
  ogDescription: "Schriftliches Deliverable in einem Arbeitstag. Einstieg vor Pilot.",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Audit", path: "/audit" },
]);

const STEPS = [
  "Fit-Call 15 Min (kostenlos) — passt der Scope?",
  `Audit-Tag (${audit.priceNet} € netto) — Interviews + Bestandsaufnahme`,
  "Schriftliches Dokument: Top-3 Hebel + Pilot-Festpreis-Empfehlung",
  "Sie entscheiden: Pilot, weitere Tage, oder Pause — ohne Druck",
];

export default function AuditPage() {
  return (
    <>
      <main className="pb-16 pt-28 md:pb-24 md:pt-36" data-testid="audit-page">
        <div className="site-container max-w-3xl">
          <span className="eyebrow">Produktisiert · Einstieg</span>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
            {audit.name}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-400">
            Viele „kostenlose Strategiegespräche“ enden in Folien. Unser Audit ist ein{" "}
            <span className="text-zinc-200">bezahlter Arbeitstag</span> zum bekannten Tagessatz{" "}
            {company.dayRate}&nbsp;€ netto — mit Deliverable, das Ihnen gehört.
          </p>

          <div
            className="glass mt-10 flex flex-wrap items-end justify-between gap-4 p-6"
            data-testid="audit-price"
          >
            <div>
              <div className="text-silver font-[family-name:var(--font-heading)] text-4xl font-semibold">
                {audit.priceNet.toLocaleString("de-DE")} €
              </div>
              <div className="mt-1 text-xs uppercase tracking-[0.2em] text-zinc-500">
                netto · {audit.durationHint}
              </div>
            </div>
            <Link
              href="/rueckruf?utm_source=audit&utm_medium=organic&utm_campaign=productized_audit"
              className="btn-primary inline-flex items-center gap-2"
              data-testid="audit-cta"
            >
              <ClipboardCheck className="size-4" />
              Audit anfragen
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <ul className="mt-10 space-y-3" data-testid="audit-bullets">
            {audit.bullets.map((b) => (
              <li key={b} className="flex gap-3 text-sm text-zinc-300">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-zinc-500" />
                {b}
              </li>
            ))}
          </ul>

          <h2 className="mt-14 font-[family-name:var(--font-heading)] text-2xl font-light text-white">
            Ablauf
          </h2>
          <ol className="mt-6 space-y-3" data-testid="audit-steps">
            {STEPS.map((s, i) => (
              <li key={s} className="flex gap-3 text-sm text-zinc-300">
                <span className="font-[family-name:var(--font-heading)] text-zinc-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ol>

          <p className="mt-10 text-sm text-zinc-500">
            Anchoring: Klassische IT-/Agentur-Tagessätze liegen oft bei 1.000–1.500&nbsp;€ netto —
            wir rechnen transparent mit {company.dayRate}&nbsp;€. Keine erfundenen Konkurrenz-Zitate.
            Ausschließlich B2B.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/preise" className="btn-ghost" data-testid="audit-to-preise">
              Alle Pakete
            </Link>
            <Link href="/branchen" className="btn-ghost" data-testid="audit-to-branchen">
              Branchen
            </Link>
            <Link href="/checkliste" className="btn-ghost" data-testid="audit-to-checkliste">
              Kostenlose Checkliste
            </Link>
          </div>
        </div>
      </main>
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
