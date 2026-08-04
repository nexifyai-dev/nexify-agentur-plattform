// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/app/karriere/page.tsx
// NIR: 04.08.2026 09:40
// UPDATED: 04.08.2026 09:40
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI Dev
// WHAT: Karriere/Jobs-Seite — ehrlich: keine offenen Stellen, nur Initiativbewerbung
// WHY: Talent-Page fehlte (soft-404); ehrliche Kommunikation verhindert Enttäuschung
// BEST-PRACTICE: Keine falschen Hoffnungen, klare Initiativbewerbungs-CTA
// PITFALL: V-KARRIERE-01: Keine erfundenen Stellenangebote
// DEPENDS: /api/contact, company, lib/seo
// DOCS-REF: docs/governance/CHARTA.md
// SESSION: issue-230-karriere-7dd5

import { pageMetadata, breadcrumbListJsonLd, webPageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { KarrierePage } from "@/components/pages/karriere";

export const metadata = pageMetadata({
  title: "Karriere bei NeXify AI — Initiativbewerbung",
  description:
    "Aktuell keine offenen Stellen — aber wir freuen uns über Initiativbewerbungen von Entwicklern, AI-Spezialisten und kreativen Köpfen, die NeXify AI voranbringen wollen.",
  path: "/karriere",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Karriere", path: "/karriere" },
]);

const pageJsonLd = webPageJsonLd({
  title: "Karriere bei NeXify AI",
  description:
    "Aktuell keine offenen Stellen — aber wir freuen uns über Initiativbewerbungen.",
  path: "/karriere",
  dateModified: "2026-08-04",
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={pageJsonLd} />
      <KarrierePage />
    </>
  );
}
