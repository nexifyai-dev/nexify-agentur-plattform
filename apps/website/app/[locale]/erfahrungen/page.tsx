// FILE: /apps/website/app/[locale]/erfahrungen/page.tsx
// NIR: 08.08.2026
// UPDATED: 08.08.2026
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Locale-prefix fallback für /erfahrungen (Safety net, analog /referenzen)
// WHY: Middleware strippt locale-Präfixe auf unpräfixierte Routen — dieser Baum
//      ist nur erreichbar wenn die Middleware ausfällt; dann kein 404.
// BEST-PRACTICE: Konsistenz mit /referenzen (app/[locale]/referenzen/page.tsx)
// DEPENDS: components/pages/experiences
// DOCS-REF: FREWERT-MARKETING-MASSNAHMENKATALOG M-04
// SESSION: t_ceb434ff M-04

import type { Metadata } from "next";
import { ExperiencesPage } from "@/components/pages/experiences";

export const metadata: Metadata = {
  title: "Erfahrungen — Kundenstimmen zu Web, Commerce & Automatisierung",
};

export default function Page() {
  return <ExperiencesPage />;
}
