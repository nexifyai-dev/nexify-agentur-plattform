// FILE: /apps/website/app/suche/page.tsx
// NIR: 08.08.2026 13:50
// UPDATED: 08.08.2026 13:50
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: SSR-Seitensuche über Leistungen, Wissen, Branchen und FAQ (DE)
// WHY: M-02: WebSite-SearchAction muss auf eine echte Suche zielen —
//      ein Platzhalter-/totes Suchziel wäre Rich-Results-Penalty-Risiko.
// BEST-PRACTICE: SearchParams (stati­cally rendered), indexable (kein noindex),
//      SSR (kein use client) — Crawler sehen Ergebnisse, Suche bleibt schlank.
// PITFALL: V-SEO-L01: Kein noindex auf /suche (Hauptindexseite);
//          keine client-side fetch-Suche (SSR über Datenmodule).
// DEPENDS: lib/seo, lib/gtm/leistungen-seo, lib/gtm/branchen,
//          lib/content/wissen-articles, lib/content/faq-categories, lib/content/de
// SESSION: kanban t_d13d48e3

import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, breadcrumbListJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { leistungenSeo } from "@/lib/gtm/leistungen-seo";
import { branchen } from "@/lib/gtm/branchen";
import { WISSEN_ARTICLES } from "@/lib/content/wissen-articles";
import { flattenFaqItems } from "@/lib/content/faq-categories";
import { de } from "@/lib/content/de";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const query = (q ?? "").trim().slice(0, 80);
  return pageMetadata({
    title: query
      ? `Suche: ${query} | NeXify AI`
      : "Suche — NeXify AI: Leistungen, Wissen, Branchen",
    description: query
      ? `Suchergebnisse für „${query}“ bei NeXify AI — Leistungen, Wissen, Branchen und FAQ.`
      : "Durchsuchen Sie Leistungen, Wissen, Branchen und FAQ von NeXify AI — 449 € netto pro Arbeitstag.",
    path: "/suche",
  });
}

type Hit = {
  title: string;
  url: string;
  description: string;
  kind: "Leistung" | "Branche" | "Wissen" | "FAQ";
};

function normalize(value: string): string {
  return value.toLowerCase().replace(/[äöüß]/g, (m) => ({ ä: "ae", ö: "oe", ü: "ue", ß: "ss" })[m] ?? m);
}

function searchIndex(): Hit[] {
  const faqItems = flattenFaqItems(de.faqCategories);
  return [
    ...leistungenSeo.map((l) => ({
      title: l.shortTitle,
      url: `/leistungen/${l.slug}`,
      description: l.answerFirst,
      kind: "Leistung" as const,
    })),
    ...branchen.map((b) => ({
      title: b.title,
      url: `/branchen/${b.slug}`,
      description: b.description,
      kind: "Branche" as const,
    })),
    ...WISSEN_ARTICLES.map((a) => ({
      title: a.title,
      url: `/wissen/${a.slug}`,
      description: a.description,
      kind: "Wissen" as const,
    })),
    ...faqItems.map((f, i) => ({
      title: f.q,
      url: `/faq#${encodeURIComponent(f.q.slice(0, 48).replace(/\s+/g, "-"))}`,
      description: f.a,
      kind: "FAQ" as const,
      key: `faq-${i}`,
    })),
  ];
}

export default async function SuchePage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const breadcrumbJsonLd = breadcrumbListJsonLd([
    { name: "Home", path: "/" },
    { name: "Suche", path: "/suche" },
  ]);

  const hits: Hit[] = query
    ? searchIndex()
        .map((h) => ({ h, score: scoreHit(h, query) }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 24)
        .map((x) => x.h)
    : [];

  function scoreHit(hit: Hit, rawQuery: string): number {
    const q = normalize(rawQuery);
    const title = normalize(hit.title);
    const desc = normalize(hit.description);
    const tokens = q.split(/\s+/).filter(Boolean);
    let score = 0;
    for (const token of tokens) {
      if (title.includes(token)) score += 3;
      if (desc.includes(token)) score += 1;
    }
    return score;
  }

  return (
    <>
      <main className="pb-16 pt-28 md:pb-24 md:pt-36" data-testid="suche-page">
        <div className="site-container max-w-3xl">
          <span className="eyebrow">Suche</span>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
            Suche
          </h1>
          <form action="/suche" method="get" className="mt-8">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Leistungen, Wissen, Branchen, FAQ durchsuchen…"
              aria-label="Suchbegriff"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white placeholder:text-zinc-500 focus:border-white/25 focus:outline-none"
            />
            <button
              type="submit"
              className="mt-4 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-zinc-950 hover:bg-zinc-200"
            >
              Suchen
            </button>
          </form>

          {query ? (
            hits.length > 0 ? (
              <ul className="mt-10 space-y-5">
                {hits.map((hit) => (
                  <li key={hit.url + ((hit as { key?: string }).key ?? "")} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <Link href={hit.url} className="text-lg font-semibold text-white hover:underline">
                      {hit.title}
                    </Link>
                    <p className="mt-1 text-sm text-zinc-400">{hit.description}</p>
                    <span className="mt-2 inline-block rounded-full border border-white/12 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                      {hit.kind}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-10 text-zinc-400">
                Keine Treffer für „{query}“. Versuchen Sie einen anderen Begriff oder besuchen Sie{" "}
                <Link href="/leistungen" className="text-white underline">Leistungen</Link>,{" "}
                <Link href="/wissen" className="text-white underline">Wissen</Link> oder{" "}
                <Link href="/faq" className="text-white underline">FAQ</Link>.
              </p>
            )
          ) : (
            <p className="mt-10 text-zinc-400">
              Geben Sie oben einen Begriff ein — durchsucht werden Leistungen, Branchen,
              Wissen-Artikel und FAQ.
            </p>
          )}
        </div>
      </main>
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
