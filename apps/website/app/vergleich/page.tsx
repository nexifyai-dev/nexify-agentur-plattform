// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/app/vergleich/page.tsx
// NIR: 02.08.2026 10:10
// UPDATED: 02.08.2026 10:18
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Comparison page — classical IT day rates vs NeXify 449 € + delivery quality story
// WHY: SEO acquisition for „Agentur vs Freelance / klassische IT“ intent without paid ads
// BEST-PRACTICE: Honest ranges; no fake testimonials; CTA to /rueckruf + /kontakt
// PITFALL: V-GTM-COMP-01: Do not invent competitor prices — use industry ballpark + own SoT
// DEPENDS: company.dayRate, lib/seo
// DOCS-REF: docs/gtm/ONGOING-GAP-AND-ACQUISITION-RADAR.md
// SESSION: proactive-gaps-acquisition-7dd5

import Link from "next/link";
import { ArrowRight, Check, GitBranch } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { company } from "@/lib/company";
import { breadcrumbListJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Vergleich — Klassische IT vs NeXify AI (449 € Tagessatz)",
  description:
    "Klassische IT-Tagessätze oft 1.000–1.500 € — NeXify AI: 449 € netto/Tag, persönlich verantwortet. Transparenter Vergleich für KMU in DACH + NL.",
  path: "/vergleich",
  ogTitle: "Klassische IT vs NeXify AI — ehrlicher Preisvergleich",
  ogDescription:
    "Marktübliche Agentur-/IT-Tagessätze vs. 449 € netto bei NeXify AI. Prozess, Repo-Qualität, B2B-Transparenz.",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Vergleich", path: "/vergleich" },
]);

const rows = [
  {
    label: "Typischer Tagessatz (netto)",
    classical: "oft 1.000–1.500 €",
    nexify: `${company.dayRate} €`,
  },
  {
    label: "Ansprechpartner",
    classical: "häufig Account → Junior-Durchlauf",
    nexify: "Pascal Courbois persönlich",
  },
  {
    label: "Liefernachweis",
    classical: "Slides / geschlossene Tools",
    nexify: "GitHub / GitLab, Reviews, CI",
  },
  {
    label: "KI-Nutzung",
    classical: "oft Aufpreis oder Blackbox",
    nexify: "AI-beschleunigt, menschlich freigegeben",
  },
  {
    label: "Zielgruppe",
    classical: "Enterprise & Retainer",
    nexify: "KMU B2B DACH + NL",
  },
];

export default function VergleichPage() {
  return (
    <>
      <main className="pb-16 pt-28 md:pb-24 md:pt-36" data-testid="vergleich-page">
        <div className="site-container max-w-4xl">
          <span className="eyebrow">Vergleich · Transparenz</span>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
            Klassische IT vs. NeXify AI
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Viele Agenturen und Systemhäuser rechnen mit Tagessätzen zwischen etwa{" "}
            <span className="text-zinc-200">1.000 und 1.500&nbsp;€ netto</span>. NeXify AI
            arbeitet mit einem festen Tagessatz von{" "}
            <span className="text-zinc-200">{company.dayRate}&nbsp;€ netto</span> — AI-beschleunigt,
            persönlich verantwortet, mit nachvollziehbarer Repo-Qualität.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-zinc-500">
            Die Spanne 1.000–1.500&nbsp;€ ist ein marktüblicher Richtwert für klassische IT-/Agentur-
            Tagessätze im DACH-Raum — keine Aussage über einen konkreten Wettbewerber.
          </p>

          <div
            className="mt-12 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]"
            data-testid="vergleich-table"
          >
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                  <th className="px-5 py-4 font-bold">Kriterium</th>
                  <th className="px-5 py-4 font-bold">Klassische IT / Agentur</th>
                  <th className="px-5 py-4 font-bold text-white">NeXify AI</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-4 font-medium text-zinc-300">{r.label}</td>
                    <td className="px-5 py-4 text-zinc-500">{r.classical}</td>
                    <td className="px-5 py-4 text-zinc-100">{r.nexify}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section className="mt-14" data-testid="vergleich-quality">
            <div className="flex items-start gap-3">
              <GitBranch className="mt-1 shrink-0 text-zinc-400" size={20} aria-hidden />
              <div>
                <h2 className="font-[family-name:var(--font-heading)] text-2xl font-light text-white">
                  Qualität wie in professionellen Repos
                </h2>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-zinc-400">
                  Lieferungen landen in GitHub oder GitLab: Branches, Reviews, CI-Checks und
                  nachvollziehbare Historie — nicht nur eine ZIP per E-Mail. So bleibt Ihr Projekt
                  wartbar, auditierbar und unabhängig vom Anbieter.
                </p>
                <ul className="mt-5 space-y-2 text-sm text-zinc-300">
                  {[
                    "Code-Ownership klar bei Ihnen",
                    "Keine Blackbox-Plattform als Lock-in",
                    "Tagessatz ohne versteckte Setup-Staffeln",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <Check size={14} className="text-emerald-400/80" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="mt-14 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-8 md:p-10" data-testid="vergleich-cta">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-light text-white">
              Passt das zu Ihrem Vorhaben?
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">
              Produktisierter Einstieg wie bei starken KI-Agenturen — bei uns transparent: Fit-Call →
              Audit (449&nbsp;€) → Pilot (5 Tage). Ausschließlich B2B.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/rueckruf" className="btn-primary !px-6 !py-3 !text-[13px]" data-testid="vergleich-cta-booking">
                Termin buchen <ArrowRight className="size-4" />
              </Link>
              <Link href="/audit" className="btn-ghost !px-6 !py-3 !text-[13px]" data-testid="vergleich-cta-audit">
                Audit ansehen
              </Link>
              <Link href="/preise" className="btn-ghost !px-6 !py-3 !text-[13px]" data-testid="vergleich-cta-pricing">
                Pakete & Preise
              </Link>
            </div>
          </section>

          <section className="mt-14" data-testid="vergleich-leistungen-links">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-light text-white">
              Leistungen im Detail
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Jede Leistung hat eine eigene SEO-Seite mit FAQ und Termin-CTA.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                ["websites", "Website"],
                ["automatisierung", "Automatisierung"],
                ["ai-agenten", "AI-Agenten"],
                ["ki-begleiter", "KI-Begleiter"],
                ["audit", "Audit"],
                ["white-label", "White-Label"],
              ].map(([slug, label]) => (
                <Link
                  key={slug}
                  href={`/leistungen/${slug}`}
                  className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  {label}
                </Link>
              ))}
              <Link href="/leistungen" className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-300">
                alle Leistungen
              </Link>
              <Link href="/branchen" className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-300">
                Branchen
              </Link>
            </div>
          </section>
        </div>
      </main>
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
