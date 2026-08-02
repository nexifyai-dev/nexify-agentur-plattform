// FILE: /apps/website/app/danke/page.tsx
// NIR: 02.08.2026 10:50
// UPDATED: 02.08.2026 10:50
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Thank-you landing after contact / lead-magnet
// WHY: Confirm receipt + soft CTA to /rueckruf without fake urgency
// BEST-PRACTICE: noIndex; brand-first; one CTA group
// PITFALL: V-GTM-DANK: No fake metrics
// DEPENDS: lib/seo
// DOCS-REF: docs/gtm/ZERO-COST-ACQUISITION-PLAYBOOK.md
// SESSION: zero-cost-leads-mailing-7dd5

import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Danke — Anfrage erhalten | NeXify AI",
  description:
    "Vielen Dank für Ihre Anfrage. Wir melden uns in der Regel innerhalb eines Werktags persönlich.",
  path: "/danke",
  noIndex: true,
});

export default function DankePage() {
  return (
    <main className="flex min-h-[70vh] items-center pt-24" data-testid="thank-you-page">
      <div className="site-container max-w-2xl text-center">
        <p className="text-silver text-sm uppercase tracking-[0.2em]">NeXify AI</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-semibold text-zinc-50">
          Danke — wir haben Ihre Anfrage.
        </h1>
        <p className="mt-4 text-lg text-zinc-400">
          In der Regel antworten wir innerhalb eines Werktags persönlich. Kein Bot-Spam, keine
          Fake-Dringlichkeit.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/rueckruf" className="btn-primary inline-flex" data-testid="thank-you-booking">
            Optional: Rückruf-Slot sichern
          </Link>
          <Link href="/checkliste" className="btn-secondary inline-flex" data-testid="thank-you-checkliste">
            Checkliste ansehen
          </Link>
        </div>
      </div>
    </main>
  );
}
