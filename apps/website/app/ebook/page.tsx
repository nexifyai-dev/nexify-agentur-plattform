// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/app/ebook/page.tsx
// NIR: 08.08.2026 12:05
// UPDATED: 08.08.2026 12:05
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: E-Book-Lead-Magnet-Landingpage /ebook — 10 Strategien, Formular (Name+E-Mail+Opt-in), UTM-Tracking, PDF-Direktlink, Dank-Zustand mit Download.
// WHY: M-01 (FREWERT-MASSNAHMENKATALOG) — eigener Lead-Magnet statt /api/contact, Scarcity („solange verfügbar"), CI-Design (dunkle Karte #111114, Lime #C8FF00).
// BEST-PRACTICE: Opt-in-Pflicht vor Versand; E-Mail-Versand via /api/ebook (Resend); PDF auch direkt verlinkt (kein falscher Erfolg wenn Mail fehlschlägt).
// PITFALL: V-GTM-LM-01: nicht „Mail gesendet" behaupten wenn API 5xx; V-UTM: Quelle im Lead speichern.
// DEPENDS: /api/ebook, lib/company, public/docs/nexify-ebook-ki-automation.pdf
// DOCS-REF: docs/plans/FREWERT-MARKETING-MASSNAHMENKATALOG-2026-08-08.md (M-01)
// SESSION: kanban-t_34e02d47

import { pageMetadata, breadcrumbListJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { EbookLanding } from "@/components/pages/ebook";

export const metadata = pageMetadata({
  title: "E-Book: KI-Automation für den Mittelstand — 10 Strategien (kostenlos)",
  description:
    "10 konkrete KI-Strategien für DACH-KMU: Chatbot, E-Mail-Automation, Angebote, Lead-Nachverfolgung. Jetzt kostenlos als E-Book laden — solange verfügbar.",
  path: "/ebook",
  ogTitle: "E-Book: KI-Automation für den Mittelstand | NeXify AI",
  ogDescription:
    "10 Strategien, die sofort Zeit & Geld sparen. Konkrete Anwendungsfälle für DACH-KMU. Kostenlos.",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "E-Book: KI-Automation", path: "/ebook" },
]);

export default function EbookPage() {
  return (
    <>
      <EbookLanding />
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
