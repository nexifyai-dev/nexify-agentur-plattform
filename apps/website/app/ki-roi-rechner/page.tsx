// FILE: apps/website/app/ki-roi-rechner/page.tsx
// NIR: 08.08.2026 12:00
// UPDATED: 08.08.2026 12:00
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Landing-Page KI-ROI-Rechner (M-07) — interaktiver Rechner, SEO-Meta, WebApplication-Schema
// WHY: Linkbait/Lead-Magnet; reine Client-Berechnung; Schema + Meta für Rich Results
// BEST-PRACTICE: CI-konform (ZK §7); Seite funktioniert ohne JavaScript? Nein — Rechner ist Client-only, Inhalt bleibt crawlbar (Text)
// PITFALL: V-GTM-07: keine erfundenen Benchmarks; Meta-Titel enthält Keyword „KI-ROI-Rechner kostenlos"
// DEPENDS: components/roi-calculator, lib/gtm/free-tools (WORK_WEEKS_PER_YEAR), lib/seo (pageMetadata, serializeJsonLd)
// DOCS-REF: docs/standards/ZENTRALE-KONFIGURATION.md §7; M-02 Schema-Muster
// SESSION: t_dfa9459e — M-07 Free-Tools
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RoiCalculator } from "@/components/roi-calculator";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata, breadcrumbListJsonLd, serializeJsonLd, absoluteUrl } from "@/lib/seo";
import { WORK_WEEKS_PER_YEAR } from "@/lib/gtm/free-tools";

export const metadata: Metadata = pageMetadata({
  title: "KI-ROI-Rechner kostenlos — Automatisierungspotenzial berechnen",
  description:
    "Kostenloser KI-ROI-Rechner: Berechnen Sie in 30 Sekunden, was 20/40/60 % Automatisierung Ihres Teams jährlich sparen. Keine Anmeldung, keine Datenweitergabe.",
  path: "/ki-roi-rechner",
  ogTitle: "KI-ROI-Rechner kostenlos — NeXify AI",
  ogDescription: "Ersparnis durch KI-Automatisierung in 30 Sekunden berechnen — ohne Anmeldung.",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "KI-ROI-Rechner", path: "/ki-roi-rechner" },
]);

// schema.org WebApplication — interaktives Tool, indexierbar (M-02-Muster).
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "KI-ROI-Rechner",
  url: absoluteUrl("/ki-roi-rechner"),
  description:
    "Berechnet die jährliche Ersparnis durch KI-Automatisierung (20/40/60 %) aus Mitarbeiterzahl, manuellen Stunden und Stundensatz.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  inLanguage: "de",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  provider: { "@type": "Organization", name: "NeXify AI", url: "https://www.nexifyai.cloud" },
};

export default function Page() {
  return (
    <>
      <main className="pb-16 pt-28 md:pb-24 md:pt-36" data-testid="ki-roi-rechner-page">
        <div className="site-container">
          <span className="eyebrow">Kostenloses Tool · ohne Anmeldung</span>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
            KI-ROI-Rechner: Was spart Ihnen Automatisierung?
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-400">
            Geben Sie ein, wie viel manuelle Routinearbeit Ihr Team leistet — der Rechner zeigt,
            was 20, 40 und 60 % Automatisierung jährlich wert sind. Keine Anmeldung, keine
            Datenweitergabe, keine erfundenen Benchmarks: gerechnet wird ausschließlich mit Ihren Zahlen.
          </p>

          <div className="mt-12">
            <RoiCalculator />
          </div>

          <section className="mt-16 grid gap-6 md:grid-cols-3" data-testid="roi-hints">
            <div className="glass p-6">
              <h2 className="font-[family-name:var(--font-heading)] text-lg font-medium text-white">Wie wird gerechnet?</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                {WORK_WEEKS_PER_YEAR} Arbeitswochen pro Jahr × wöchentliche manuelle Stunden × Stundensatz
                = jährliche Personalkosten für Routinearbeit. Automatisierungsgrad ergibt die Ersparnis.
              </p>
            </div>
            <div className="glass p-6">
              <h2 className="font-[family-name:var(--font-heading)] text-lg font-medium text-white">Welcher Stundensatz?</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Nutzen Sie die Vollkosten: Bruttogehalt inkl. Arbeitgeberanteil (~20 %). 60–80 € sind
                für viele KMU realistisch, je nach Rolle auch deutlich mehr.
              </p>
            </div>
            <div className="glass p-6">
              <h2 className="font-[family-name:var(--font-heading)] text-lg font-medium text-white">Was kostet Automatisierung?</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                NeXify AI arbeitet zum festen Tagessatz von 449 € netto. Viele Automatisierungen starten
                mit 2–5 Tagen — die Ersparnis oben übersteigt das meist im ersten Jahr.
              </p>
              <Link href="/preise?utm_source=ki-roi-rechner&utm_medium=organic&utm_campaign=ki-roi-rechner_preise" className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-zinc-300 transition-colors hover:text-white" data-testid="roi-hint-pricing">
                Preise ansehen <ArrowRight size={14} />
              </Link>
            </div>
          </section>
        </div>
      </main>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={webAppJsonLd} />
    </>
  );
}
