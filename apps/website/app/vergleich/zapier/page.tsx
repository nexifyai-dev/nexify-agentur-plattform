import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { company } from "@/lib/company";
import { breadcrumbListJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Zapier vs NeXify AI — Standard-Automation oder individuelle Delivery?",
  description:
    "Zapier startet schnell bei Standard-Integrationen. NeXify AI liefert individuelle Umsetzung, Qualitätssicherung und eine nachvollziehbare Übergabe für KMU.",
  path: "/vergleich/zapier",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Vergleich", path: "/vergleich" },
  { name: "vs Zapier", path: "/vergleich/zapier" },
]);

const rows = [
  { label: "Einstieg", zapier: "sehr schnell für Standardfälle", nexify: "gezielte Umsetzung für Ihren echten Prozess" },
  { label: "Individualisierung", zapier: "begrenzte Tiefe", nexify: "frei modellierbar, dokumentiert" },
  { label: "Laufende Pflege", zapier: "intern zu tragen", nexify: "persönlich begleitet und übergabefähig" },
  { label: "Preislogik", zapier: "Abo + Volumen", nexify: `${company.dayRate} € netto / Arbeitstag` },
  { label: "Nachweis", zapier: "Tool-Konfiguration", nexify: "GitHub / GitLab, CI, Reviews" },
];

export default function VergleichZapierPage() {
  return (
    <>
      <main className="pb-16 pt-28 md:pb-24 md:pt-36" data-testid="vergleich-zapier-page">
        <div className="site-container max-w-4xl">
          <span className="eyebrow">Vergleich · No-Code</span>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
            Zapier vs. NeXify AI
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Zapier ist oft der schnellste Weg zum ersten Automations-Prototyp. Wenn Prozesse zentral
            werden oder mehrere Systeme sauber zusammenspielen müssen, steigen Anforderungen an Struktur und Verantwortung.
          </p>
          <div className="mt-12 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]" data-testid="vergleich-zapier-table">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                  <th className="px-5 py-4 font-bold">Kriterium</th>
                  <th className="px-5 py-4 font-bold">Nur Zapier</th>
                  <th className="px-5 py-4 font-bold text-white">NeXify AI</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-4 font-medium text-zinc-300">{r.label}</td>
                    <td className="px-5 py-4 text-zinc-500">{r.zapier}</td>
                    <td className="px-5 py-4 text-zinc-100">{r.nexify}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-10 space-y-2 text-sm text-zinc-300">
            {[
              "Zapier ist legitim für kleine Standard-Automationen und frühe Experimente.",
              "Wir helfen, wenn daraus ein belastbarer Prozess mit Ownership, Review und Übergabe werden soll.",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <Check size={14} className="mt-1 shrink-0 text-emerald-400/80" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/rueckruf" className="btn-primary !px-6 !py-3 !text-[13px]" data-testid="vergleich-zapier-cta">
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
