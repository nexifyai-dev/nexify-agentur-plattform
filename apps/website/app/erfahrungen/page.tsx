// FILE: /apps/website/app/erfahrungen/page.tsx
// NIR: 08.08.2026
// UPDATED: 08.08.2026
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: /erfahrungen Review-Landingpage für den Suchbegriff „NeXify AI Erfahrungen“
// WHY: M-04 FREWERT-MARKETING-MASSNAHMENKATALOG Trick 22 — dedizierte Landingpage
//      mit echten Kundenstimmen (Quelle: /referenzen, anonymisiert, permission-first),
//      Schema Review statt AggregateRating (keine erfundenen Bewertungen, V-GTM-TRUST-01).
// BEST-PRACTICE: Nur freigegebene/anonymisierte Stimmen; kein AggregateRating ohne echte Reviews;
//      Sterne nur als visuelles 5/5-Muster auf echten Zitaten, nicht als Schema-Aggregat.
// PITFALL: V-GTM-TRUST-01/02 — nie AggregateRating ohne nachweisbare Reviews (docs/gtm/TESTIMONIAL-PERMISSION-PIPELINE_V1.md)
// DEPENDS: lib/content/{de,en,nl}.ts (references.quotes), lib/seo.ts, components/json-ld, components/pages/experiences
// DOCS-REF: /var/lib/docker/volumes/hermes-webui-q5zm_hermes-workspace/_data/nexifyai/docs/plans/FREWERT-MARKETING-MASSNAHMENKATALOG-2026-08-08.md
// SESSION: t_ceb434ff M-04

import { ExperiencesPage } from "@/components/pages/experiences";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbListJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Erfahrungen mit NeXify AI — Kundenstimmen zu Websites, Shops & Automatisierung",
  description:
    "Was Kunden über die Zusammenarbeit mit NeXify AI sagen: echte Stimmen zu Websites, Onlineshops und AI-Automatisierung – transparent, anonymisiert, ohne Fake-Bewertungen.",
  path: "/erfahrungen",
  ogTitle: "Erfahrungen mit NeXify AI — echte Kundenstimmen",
  ogDescription:
    "Kundenstimmen zu Web, Commerce & Automatisierung. Ehrliche Einblicke statt Fake-Reviews – 449 € netto pro Arbeitstag, persönlich verantwortet.",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Erfahrungen", path: "/erfahrungen" },
]);

export default function Page() {
  return (
    <>
      <ExperiencesPage />
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
