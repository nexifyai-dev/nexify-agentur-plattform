// FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/app/partner/layout.tsx
// NIR: 02.08.2026 10:50
// UPDATED: 02.08.2026 10:50
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Metadata for partner referral landing
// WHY: SEO for partnership intent without paid ads
// BEST-PRACTICE: pageMetadata + breadcrumb JSON-LD
// PITFALL: V-CAC-PART-02: No invented commission rates in meta
// DEPENDS: lib/seo
// DOCS-REF: docs/gtm/RESEARCH-FREE-CAC-2026.md
// SESSION: research-free-cac-full-7dd5

import type { ReactNode } from "react";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbListJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Partner werden — Empfehlungen & Co-Marketing | NeXify AI",
  description:
    "Empfehlungspartner für Websites, Shops und AI-Automatisierung (449 € Tagessatz). Kostenloses Kennenlernen für Steuerberater, SEO-Freelancer und Studios in DACH + NL.",
  path: "/partner",
  ogTitle: "Partnerprogramm (Referral) | NeXify AI",
  ogDescription: "Co-Marketing und Empfehlungen ohne Paid Ads — persönlich mit Pascal Courbois.",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Partner", path: "/partner" },
]);

export default function PartnerLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
