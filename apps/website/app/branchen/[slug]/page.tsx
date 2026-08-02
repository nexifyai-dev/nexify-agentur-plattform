// FILE: /apps/website/app/branchen/[slug]/page.tsx
// NIR: 02.08.2026 10:50
// UPDATED: 02.08.2026 10:50
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Dynamic branchen landing — pain / outcome / audit CTA
// WHY: Competitor industry SEO pattern without copying their copy
// BEST-PRACTICE: generateStaticParams; honest CTAs; data-testid
// PITFALL: V-GTM-BR-03: 404 unknown slug; no invented metrics
// DEPENDS: lib/gtm/branchen, company
// DOCS-REF: docs/gtm/STRONGEST-COMPETITORS-2026.md
// SESSION: strongest-competitors-tactics-7dd5

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { company } from "@/lib/company";
import { branchenSlugs, getBranche } from "@/lib/gtm/branchen";
import { breadcrumbListJsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return branchenSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const b = getBranche(slug);
  if (!b) return {};
  return pageMetadata({
    title: `${b.title.split("—")[0].trim()} | NeXify AI`,
    description: b.description.slice(0, 155),
    path: `/branchen/${slug}`,
    ogTitle: b.title,
    ogDescription: b.offerHint,
  });
}

export default async function BranchePage({ params }: Props) {
  const { slug } = await params;
  const b = getBranche(slug);
  if (!b) notFound();

  const breadcrumbJsonLd = breadcrumbListJsonLd([
    { name: "Home", path: "/" },
    { name: "Branchen", path: "/branchen" },
    { name: b.title.split("—")[0].trim(), path: `/branchen/${slug}` },
  ]);

  return (
    <>
      <main className="pb-16 pt-28 md:pb-24 md:pt-36" data-testid={`branche-page-${slug}`}>
        <div className="site-container max-w-3xl">
          <span className="eyebrow">{b.eyebrow}</span>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
            {b.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-400">{b.description}</p>

          <h2 className="mt-12 font-[family-name:var(--font-heading)] text-2xl font-light text-white">
            Typische Engpässe
          </h2>
          <ul className="mt-4 space-y-3" data-testid="branche-pains">
            {b.pains.map((p) => (
              <li key={p} className="flex gap-3 text-sm text-zinc-300">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-zinc-500" />
                {p}
              </li>
            ))}
          </ul>

          <h2 className="mt-12 font-[family-name:var(--font-heading)] text-2xl font-light text-white">
            Was wir anpacken
          </h2>
          <ul className="mt-4 space-y-3" data-testid="branche-outcomes">
            {b.outcomes.map((o) => (
              <li key={o} className="flex gap-3 text-sm text-zinc-300">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-500/60" />
                {o}
              </li>
            ))}
          </ul>

          <p className="mt-8 text-sm text-zinc-500">{b.offerHint}</p>
          <p className="mt-2 text-sm text-zinc-600">
            Tagessatz {company.dayRate}&nbsp;€ netto · ausschließlich B2B · keine erfundenen
            Erfolgsgarantien.
          </p>

          <div className="mt-8" data-testid="branche-leistungen-links">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              Passende Leistungen
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                ["websites", "Website"],
                ["automatisierung", "Automatisierung"],
                ["ai-agenten", "AI-Agenten"],
                ["audit", "Audit"],
                ["beratung", "Beratung"],
              ].map(([s, label]) => (
                <Link
                  key={s}
                  href={`/leistungen/${s}`}
                  className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  {label}
                </Link>
              ))}
              <Link
                href="/leistungen"
                className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-zinc-500"
              >
                alle
              </Link>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={`/rueckruf?utm_source=branchen&utm_campaign=${slug}`}
              className="btn-primary inline-flex items-center gap-2"
              data-testid="branche-cta-rueckruf"
            >
              Rückruf buchen
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/audit"
              className="btn-ghost inline-flex items-center gap-2"
              data-testid="branche-cta-audit"
            >
              Audit ({company.dayRate} €)
            </Link>
            <Link href="/branchen" className="btn-ghost" data-testid="branche-back">
              Alle Branchen
            </Link>
          </div>
        </div>
      </main>
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
