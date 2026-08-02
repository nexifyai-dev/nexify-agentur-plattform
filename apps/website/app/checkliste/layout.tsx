// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/app/checkliste/layout.tsx
// NIR: 02.08.2026 10:10
// UPDATED: 02.08.2026 10:10
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: SEO metadata for lead-magnet checklist page
// WHY: Client page.tsx cannot export metadata; layout provides title/description
// BEST-PRACTICE: pageMetadata helper for canonical + OG
// PITFALL: V-XX: avoid duplicate titles in nested layouts
// DEPENDS: lib/seo
// DOCS-REF: docs/gtm/ONGOING-GAP-AND-ACQUISITION-RADAR.md
// SESSION: proactive-gaps-acquisition-7dd5

import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Checkliste Website & KI-Projekt — kostenfrei anfordern",
  description:
    "Kostenlose B2B-Checkliste: Ist Ihre Website und Ihr KI-Vorhaben startklar? Light E-Mail-Gate, kein Paid Funnel. NeXify AI · DACH + NL.",
  path: "/checkliste",
  ogTitle: "Checkliste Website & KI — NeXify AI",
  ogDescription: "Kostenlose Projekt-Checkliste für KMU. E-Mail eintragen, Liste erhalten.",
});

export default function ChecklisteLayout({ children }: { children: ReactNode }) {
  return children;
}
