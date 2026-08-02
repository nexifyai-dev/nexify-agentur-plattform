// FILE: /apps/website/components/leistungen-extended.tsx
// NIR: 02.08.2026 11:05
// UPDATED: 02.08.2026 11:05
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Hub grid for extended SEO leistungen beyond core 8
// WHY: Full-service coverage on /leistungen for page-1 keywords
// BEST-PRACTICE: Link to dedicated slug pages; no stuffing
// PITFALL: V-SEO-HUB-01: Keep core 8 as primary; extended is discovery
// DEPENDS: lib/gtm/leistungen-seo
// DOCS-REF: docs/gtm/PAGE1-KEYWORD-MAP.md
// SESSION: seo-page1-all-services-7dd5

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { leistungenSeo } from "@/lib/gtm/leistungen-seo";

const CORE = new Set([
  "landingpages",
  "websites",
  "onlineshops",
  "enterprise-commerce",
  "web-apps",
  "mobile-apps",
  "automatisierung",
  "ai-agenten",
]);

export function LeistungenExtended() {
  const extra = leistungenSeo.filter((l) => !CORE.has(l.slug));
  return (
    <section className="site-container mt-16 pb-4" data-testid="leistungen-extended">
      <h2 className="font-[family-name:var(--font-heading)] text-2xl font-light text-white sm:text-3xl">
        Weitere Leistungen
      </h2>
      <p className="mt-3 max-w-2xl text-sm text-zinc-500">
        KI-Begleiter, Portal, Plattform-Integration, Beratung, Workshops, White-Label und Audit —
        jeweils mit eigener SEO-Seite.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {extra.map((l) => (
          <Link
            key={l.slug}
            href={`/leistungen/${l.slug}`}
            className="glass glass-lift group block p-5 transition-colors hover:border-white/20"
            data-testid={`leistung-ext-${l.slug}`}
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              {l.eyebrow}
            </span>
            <h3 className="mt-2 font-[family-name:var(--font-heading)] text-lg font-medium text-white">
              {l.shortTitle}
            </h3>
            <p className="mt-2 line-clamp-3 text-sm text-zinc-500">{l.answerFirst}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm text-zinc-300">
              Öffnen <ArrowRight className="size-3.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
