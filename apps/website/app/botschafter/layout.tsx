// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/app/botschafter/layout.tsx
// NIR: 02.08.2026 10:50
// UPDATED: 02.08.2026 10:50
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Metadata for campus ambassador page
// WHY: Organic discovery for student ambassadors
// BEST-PRACTICE: Honest meta, no fake perks
// PITFALL: none
// DEPENDS: lib/seo
// DOCS-REF: docs/gtm/RESEARCH-FREE-CAC-2026.md
// SESSION: research-free-cac-full-7dd5

import type { ReactNode } from "react";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbListJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Campus-Botschafter — Studentisches Empfehlungsprogramm | NeXify AI",
  description:
    "Kostenloses Campus-Botschafter-Programm: Content, Warm Intros und Lernen rund um Web & AI — kein Arbeitsverhältnis, klare B2B-Ethik.",
  path: "/botschafter",
  ogTitle: "Campus-Botschafter | NeXify AI",
  ogDescription: "Studierende in DACH/NL — hilfreiche Sichtbarkeit statt Spam.",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Botschafter", path: "/botschafter" },
]);

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
