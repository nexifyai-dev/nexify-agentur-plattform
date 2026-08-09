// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/app/sprechstunde/page.tsx
// NIR: 02.08.2026 10:50
// UPDATED: 02.08.2026 10:50
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Free office-hours / workshop landing → existing /rueckruf booking
// WHY: Webinar/office-hours free CAC without new Cal SaaS spend
// BEST-PRACTICE: Reuse rückruf booking; honest agenda; B2B only
// PITFALL: V-CAC-OH-01: Do not fake live webinar dates — book real slots
// DEPENDS: /rueckruf, company
// DOCS-REF: docs/gtm/RESEARCH-FREE-CAC-2026.md
// SESSION: research-free-cac-full-7dd5

import Link from "next/link";
import { ArrowRight, CalendarClock } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { company } from "@/lib/company";
import { breadcrumbListJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Kostenlose AI-Sprechstunde — Office Hours buchen",
  description:
    "Kostenlose 20-Minuten-Sprechstunde zu Website, Shop oder AI-Automatisierung für KMU. Persönlich mit Pascal Courbois — Termin über Rückruf-Buchung.",
  path: "/sprechstunde",
  ogTitle: "AI-Sprechstunde (kostenlos) | NeXify AI",
  ogDescription: "Office Hours für B2B — kein Pitch-Theater, klare nächste Schritte.",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Sprechstunde", path: "/sprechstunde" },
]);

const AGENDA = [
  "Ist-Zustand: Website, Prozesse, Tools (5 Min)",
  "Schnelldiagnose: wo AI/Automation sinnvoll ist (8 Min)",
  "Grobe Aufwandsschätzung zum Tagessatz " + company.dayRate + " € (5 Min)",
  "Nächster Schritt: Checkliste, Angebot oder Pause (2 Min)",
];

export default function SprechstundePage() {
  return (
    <>
      <main className="pb-16 pt-28 md:pb-24 md:pt-36" data-testid="sprechstunde-page">
        <div className="site-container max-w-3xl">
          <span className="eyebrow">Office Hours · kostenfrei</span>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
            AI-Sprechstunde für KMU
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-400">
            20 Minuten mit {company.owner} — ohne Verkaufsshow. Ideal, wenn Sie prüfen wollen, ob
            eine Website, ein Shop oder eine Automatisierung sich zum Tagessatz von{" "}
            {company.dayRate}&nbsp;€ lohnt.
          </p>

          <ol className="mt-10 space-y-3" data-testid="sprechstunde-agenda">
            {AGENDA.map((item, i) => (
              <li key={item} className="flex gap-3 text-sm text-zinc-300">
                <span className="font-[family-name:var(--font-heading)] text-zinc-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              href="/rueckruf?utm_source=sprechstunde&utm_medium=organic&utm_campaign=office_hours"
              className="btn-primary inline-flex items-center gap-2"
              data-testid="sprechstunde-book"
            >
              <CalendarClock className="size-4" />
              Termin buchen
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/checkliste"
              className="btn-ghost inline-flex items-center gap-2"
              data-testid="sprechstunde-checklist"
            >
              Erst Checkliste holen
            </Link>
          </div>

          <p className="mt-8 text-sm text-zinc-500">
            B2B only. WhatsApp:{" "}
            <a
              href={`https://wa.me/${company.phoneHref.replace(/\D/g, "")}?text=${encodeURIComponent("Hallo Pascal — Sprechstunde anfragen")}`}
              className="underline underline-offset-4"
              data-testid="sprechstunde-whatsapp"
            >
              Nachricht senden
            </a>
            .
          </p>
        </div>
      </main>
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
