// FILE: apps/website/app/danke/page.tsx
// NIR: 02.08.2026 11:25
// UPDATED: 02.08.2026 11:25
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Thank-you / delight page with variant deep-links after first touch
// WHY: Neukunden P0 — clear next steps, honest Werktag target, Dark/Luxury
// BEST-PRACTICE: noindex; reuse DelightSuccess; keep legacy thank-you-page testid
// PITFALL: V-DELIGHT-04: Do not claim PDF/download completed if asset missing
// DEPENDS: components/delight-success, lib/seo
// DOCS-REF: docs/gtm/NEUKUNDEN-BEGEISTERUNG.md
// SESSION: neukunden-begeisterung-7dd5

import type { Metadata } from "next";
import { DelightSuccess } from "@/components/delight-success";
import type { DelightVariant } from "@/lib/delight-copy";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Danke — Anfrage erhalten | NeXify AI",
  description:
    "Vielen Dank für Ihre Anfrage. Wir melden uns in der Regel innerhalb eines Werktags persönlich.",
  path: "/danke",
  noIndex: true,
});

const VARIANTS: DelightVariant[] = ["contact", "booking", "offer", "lead_magnet", "generic"];

function parseVariant(raw: string | string[] | undefined): DelightVariant {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v && (VARIANTS as string[]).includes(v)) return v as DelightVariant;
  return "generic";
}

export default async function DankePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const variant = parseVariant(sp.variant);
  return (
    <main className="pb-16 pt-28 md:pb-24 md:pt-40" data-testid="danke-page">
      <div className="site-container max-w-2xl" data-testid="thank-you-page">
        <DelightSuccess lang="de" variant={variant} showCompare={variant === "lead_magnet"} />
      </div>
    </main>
  );
}
