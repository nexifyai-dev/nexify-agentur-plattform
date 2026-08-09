// FILE: apps/website/app/chatbot-kosten-rechner/page.tsx
// NIR: 08.08.2026 12:05
// UPDATED: 08.08.2026 12:05
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Landing-Page Chatbot-Kosten-Rechner (M-07) — Eigenbau vs. NeXify vs. Full-Service-Agentur
// WHY: Linkbait/Lead-Magnet; transparente Marktspannen mit Quellen, kein Preis-Etikettenschwindel
// BEST-PRACTICE: CI-konform (ZK §7); WebApplication-Schema; Quellen offen verlinkt
// PITFALL: V-GTM-07: keine erfundenen Benchmark-Zahlen — Agentur-Spannen aus WebChatAgent-Marktrecherche 2026
// DEPENDS: components/chatbot-cost-calculator, lib/gtm/free-tools, lib/seo
// DOCS-REF: docs/standards/ZENTRALE-KONFIGURATION.md §7; M-02 Schema-Muster
// SESSION: t_dfa9459e — M-07 Free-Tools
import type { Metadata } from "next";
import { ChatbotCostCalculator } from "@/components/chatbot-cost-calculator";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata, breadcrumbListJsonLd, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Chatbot-Kosten-Rechner kostenlos — Eigenbau vs. Agentur",
  description:
    "Kostenloser Chatbot-Kosten-Rechner: Eigenbau, Full-Service-Agentur oder NeXify KI-Begleiter — transparent vergleichen mit Marktspannen 2026. Keine Anmeldung.",
  path: "/chatbot-kosten-rechner",
  ogTitle: "Chatbot-Kosten-Rechner kostenlos — NeXify AI",
  ogDescription: "Chatbot-Kosten transparent vergleichen: Eigenbau vs. Agentur vs. KI-Begleiter.",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Chatbot-Kosten-Rechner", path: "/chatbot-kosten-rechner" },
]);

// schema.org WebApplication — interaktives Tool, indexierbar (M-02-Muster).
const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Chatbot-Kosten-Rechner",
  url: absoluteUrl("/chatbot-kosten-rechner"),
  description:
    "Vergleicht die einmaligen und laufenden Kosten von Chatbot-Lösungen: Eigenbau, Full-Service-Agentur und NeXify KI-Begleiter.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  inLanguage: "de",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  provider: { "@type": "Organization", name: "NeXify AI", url: "https://www.nexifyai.cloud" },
};

export default function Page() {
  return (
    <>
      <main className="pb-16 pt-28 md:pb-24 md:pt-36" data-testid="chatbot-kosten-rechner-page">
        <div className="site-container">
          <span className="eyebrow">Kostenloses Tool · ohne Anmeldung</span>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
            Chatbot-Kosten-Rechner: Eigenbau, Agentur oder NeXify?
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-400">
            Drei Wege, ein Ziel: ein Chatbot, der Kundenanfragen beantwortet. Der Rechner vergleicht
            die einmaligen und die 3-Jahres-Kosten — mit Marktspannen für Agenturen 2026 und dem
            transparenten NeXify-Tagessatz von 449 € netto.
          </p>

          <div className="mt-12">
            <ChatbotCostCalculator />
          </div>

          <section className="mt-16 glass p-6 md:p-8" data-testid="chatbot-notes">
            <h2 className="font-[family-name:var(--font-heading)] text-lg font-medium text-white">Annahmen & Quellen</h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-400">
              <li>
                <strong className="text-zinc-200">Eigenbau:</strong> 10–25 Arbeitstage (je Komplexität) zu einem
                internen Team-Tagessatz von 1.000 € (Median Backend-Entwicklung DACH, SimpleProposals 2026) plus
                API-Kosten (ca. 2 Cent/Anfrage) und 2–5 Stunden Pflege pro Woche (Chatarmin 2026).
              </li>
              <li>
                <strong className="text-zinc-200">Full-Service-Agentur:</strong> Solide KMU-Projekte 3.000–15.000 €,
                komplexe Projekte darüber — Marktspannen laut WebChatAgent-Marktrecherche 2026; Wartung 10–20 % der
                Projektsumme pro Jahr.
              </li>
              <li>
                <strong className="text-zinc-200">NeXify KI-Begleiter:</strong> ab 3 Arbeitstagen × 449 € netto
                (eigene Preisliste). Erweiterungen nach Aufwand.
              </li>
              <li>Alle Angaben netto, ohne laufende Plattform-/Hostingkosten. Kein Ersatz für ein individuelles Angebot.</li>
            </ul>
          </section>
        </div>
      </main>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={webAppJsonLd} />
    </>
  );
}
