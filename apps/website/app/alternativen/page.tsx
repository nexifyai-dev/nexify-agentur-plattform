// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/app/alternativen/page.tsx
// NIR: 02.08.2026 10:50
// UPDATED: 02.08.2026 10:50
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Alternative/comparison SEO hub — agency vs freelance vs DIY vs NeXify
// WHY: Capture „Alternative zu …“ / comparison intent without paid ads
// BEST-PRACTICE: Honest trade-offs; FAQ JSON-LD; link to vergleich + booking
// PITFALL: V-CAC-ALT-01: Never disparage named competitors — categories only
// DEPENDS: company, lib/seo
// DOCS-REF: docs/gtm/RESEARCH-FREE-CAC-2026.md
// SESSION: research-free-cac-full-7dd5

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { company } from "@/lib/company";
import { breadcrumbListJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Alternativen — Agentur, Freelancer, DIY oder NeXify AI?",
  description:
    "Wann klassische Agentur, Freelancer, No-Code-DIY oder NeXify AI (449 € Tagessatz) die bessere Wahl ist — ehrlicher Entscheidungsrahmen für KMU in DACH.",
  path: "/alternativen",
  ogTitle: "Alternativen zu teurer IT / Agentur | NeXify AI",
  ogDescription: "Vergleichskategorien ohne Fake-Claims — mit klarer Booking-CTA.",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Alternativen", path: "/alternativen" },
]);

const OPTIONS = [
  {
    title: "Klassische Full-Service-Agentur",
    good: "Breites Team, Markenprojekte, lange Retainer",
    bad: "Hohe Tagessätze, oft viele Übergaben",
    fit: "Enterprise-Budgets, große Markenrollen",
  },
  {
    title: "Einzel-Freelancer",
    good: "Günstig bei engem Scope, direkte Abstimmung",
    bad: "Ausfallrisiko, wenig CI/Repo-Disziplin möglich",
    fit: "Kleine Landingpages, einmalige Grafik",
  },
  {
    title: "DIY / No-Code-Baukästen",
    good: "Schnell starten, niedrige Einstiegskosten",
    bad: "Grenzen bei Integration, SEO, Compliance, KI-Workflows",
    fit: "Sehr einfache Visitenkarten-Sites",
  },
  {
    title: "NeXify AI",
    good: `Fester Tagessatz ${company.dayRate} €, AI-beschleunigt, GitHub/GitLab-Qualität, persönlich`,
    bad: "Kein 20-Personen-Studio — Fokus statt Masse",
    fit: "KMU B2B, die Tempo + Transparenz brauchen",
  },
];

const FAQS = [
  {
    q: "Ist NeXify AI eine Alternative zu teuren IT-Dienstleistern?",
    a: `Ja für viele KMU-Projekte: fester Tagessatz ${company.dayRate} € netto, AI-beschleunigte Lieferung, persönlich verantwortet. Enterprise-Großprogramme mit Dutzenden Rollen sind nicht unser Fokus.`,
  },
  {
    q: "Wann besser Freelancer statt NeXify?",
    a: "Wenn der Scope winzig ist (eine Grafik, ein Banner) und kein Repo/CI/Automatisierung nötig ist.",
  },
  {
    q: "Bietet ihr kostenlose Erstberatung?",
    a: "Ja — Rückruf-Termin oder AI-Sprechstunde. Keine erfundenen Erfolgsgarantien.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function AlternativenPage() {
  return (
    <>
      <main className="pb-16 pt-28 md:pb-24 md:pt-36" data-testid="alternativen-page">
        <div className="site-container max-w-4xl">
          <span className="eyebrow">Entscheidungsrahmen · SEO</span>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
            Alternativen: Agentur, Freelancer, DIY oder NeXify?
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Keine Schmähung einzelner Anbieter — nur Kategorien. Ziel: ehrlich entscheiden, dann
            buchen oder lassen.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2" data-testid="alternativen-grid">
            {OPTIONS.map((o) => (
              <article
                key={o.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                data-testid={`alternativen-card-${o.title.slice(0, 12).toLowerCase().replace(/\s+/g, "-")}`}
              >
                <h2 className="font-[family-name:var(--font-heading)] text-xl text-white">{o.title}</h2>
                <p className="mt-3 text-sm text-emerald-400/90">+</p>
                <p className="text-sm text-zinc-300">{o.good}</p>
                <p className="mt-3 text-sm text-zinc-500">−</p>
                <p className="text-sm text-zinc-400">{o.bad}</p>
                <p className="mt-4 text-xs uppercase tracking-wider text-zinc-500">Passt wenn</p>
                <p className="text-sm text-zinc-300">{o.fit}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/vergleich" className="btn-ghost inline-flex items-center gap-2" data-testid="alternativen-vergleich">
              Detailvergleich Preise <ArrowRight className="size-4" />
            </Link>
            <Link href="/rueckruf" className="btn-primary inline-flex items-center gap-2" data-testid="alternativen-book">
              Rückruf buchen
            </Link>
            <Link href="/sprechstunde" className="btn-ghost" data-testid="alternativen-office">
              Sprechstunde
            </Link>
          </div>

          <section className="mt-16" data-testid="alternativen-faq">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl text-white">FAQ</h2>
            <dl className="mt-6 space-y-6">
              {FAQS.map((f) => (
                <div key={f.q}>
                  <dt className="text-zinc-200">{f.q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-zinc-400">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </main>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />
    </>
  );
}
