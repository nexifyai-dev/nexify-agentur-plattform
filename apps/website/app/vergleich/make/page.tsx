import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { company } from "@/lib/company";
import { breadcrumbListJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Make vs NeXify AI — Workflow-Builder oder saubere Umsetzung?",
  description:
    "Make ist stark für No-Code-Automationen. NeXify AI übernimmt Architektur, Qualität, Übergabe und persönliche Verantwortung bei komplexeren Workflows.",
  path: "/vergleich/make",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Vergleich", path: "/vergleich" },
  { name: "vs Make", path: "/vergleich/make" },
]);

const rows = [
  { label: "Stärke", make: "Schnelle No-Code-Automationen", nexify: "Umsetzung inkl. Architektur und Übergabe" },
  { label: "Komplexe Logik", make: "wird schnell unübersichtlich", nexify: "geplant, dokumentiert, reviewbar" },
  { label: "Ownership", make: "oft im Tool-Wissen einzelner Personen", nexify: "Repo, CI, nachvollziehbare Historie" },
  { label: "Preislogik", make: "Abo + Task-/Operations-Kosten", nexify: `${company.dayRate} € netto / Arbeitstag` },
  { label: "Verantwortung", make: "internes DIY", nexify: "Pascal Courbois persönlich" },
];

export default function VergleichMakePage() {
  return (
    <>
      <main className="pb-16 pt-28 md:pb-24 md:pt-36" data-testid="vergleich-make-page">
        <div className="site-container max-w-4xl">
          <span className="eyebrow">Vergleich · Automatisierung</span>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
            Make vs. NeXify AI
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Make ist gut, wenn Ihr Team selbst bauen und pflegen will. Sobald Prozesse kritisch,
            teamübergreifend oder erklärungsbedürftig werden, braucht es oft mehr als einen Scenario-Builder.
          </p>
          <div className="mt-12 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]" data-testid="vergleich-make-table">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                  <th className="px-5 py-4 font-bold">Kriterium</th>
                  <th className="px-5 py-4 font-bold">Nur Make</th>
                  <th className="px-5 py-4 font-bold text-white">NeXify AI</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-4 font-medium text-zinc-300">{r.label}</td>
                    <td className="px-5 py-4 text-zinc-500">{r.make}</td>
                    <td className="px-5 py-4 text-zinc-100">{r.nexify}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-10 space-y-2 text-sm text-zinc-300">
            {[
              "DIY mit Make kann sinnvoll sein — solange Governance, Monitoring und Übergabe intern gesichert sind.",
              "Wir ersetzen Make nicht dogmatisch, sondern ergänzen oder strukturieren es bei Bedarf sauber.",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <Check size={14} className="mt-1 shrink-0 text-emerald-400/80" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/rueckruf" className="btn-primary !px-6 !py-3 !text-[13px]" data-testid="vergleich-make-cta">
              Rückruf buchen <ArrowRight className="size-4" />
            </Link>
            <Link href="/vergleich" className="btn-ghost !px-6 !py-3 !text-[13px]">Alle Vergleiche</Link>
          </div>
        </div>
      </main>
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
