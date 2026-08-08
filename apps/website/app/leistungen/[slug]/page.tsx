// FILE: /apps/website/app/leistungen/[slug]/page.tsx
// NIR: 02.08.2026 10:55
// UPDATED: 02.08.2026 10:55
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Dedicated SEO/AEO landing per Leistung — FAQ schema, answer-first, CTAs
// WHY: Page-1 + AI-citation coverage; competitor branchen-page IA adapted
// BEST-PRACTICE: Unique title/H1/meta; internal links; no AggregateRating
// PITFALL: V-SEO-L02: Unknown slug → 404; no keyword stuffing
// DEPENDS: lib/gtm/leistungen-seo, lib/seo, /rueckruf
// DOCS-REF: docs/gtm/PAGE1-KEYWORD-MAP.md
// SESSION: seo-page1-all-services-7dd5

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { company } from "@/lib/company";
import {
  getLeistungSeo,
  leistungPriceHint,
  leistungSeoSlugs,
  leistungenSeo,
} from "@/lib/gtm/leistungen-seo";
import { breadcrumbListJsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return leistungSeoSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const l = getLeistungSeo(slug);
  if (!l) return {};
  return pageMetadata({
    title: `${l.metaTitle} | NeXify AI`,
    description: l.metaDescription.slice(0, 160),
    path: `/leistungen/${slug}`,
    ogTitle: l.h1,
    ogDescription: l.answerFirst.slice(0, 160),
  });
}

export default async function LeistungDetailPage({ params }: Props) {
  const { slug } = await params;
  const l = getLeistungSeo(slug);
  if (!l) notFound();

  const path = `/leistungen/${slug}`;
  const breadcrumbJsonLd = breadcrumbListJsonLd([
    { name: "Home", path: "/" },
    { name: "Leistungen", path: "/leistungen" },
    { name: l.shortTitle, path },
  ]);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: l.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: l.shortTitle,
    description: l.answerFirst,
    url: `https://www.nexifyai.cloud${path}`,
    provider: {
      "@type": "Organization",
      name: company.legalName,
      url: "https://www.nexifyai.cloud",
    },
    areaServed: ["DE", "AT", "CH", "NL"],
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      description: `${l.daysLabel} · ${leistungPriceHint(l)} · Tagessatz ${company.dayRate} €`,
      url: `https://www.nexifyai.cloud${path}`,
    },
  };

  const related = l.related
    .map((s) => leistungenSeo.find((x) => x.slug === s))
    .filter(Boolean);

  return (
    <>
      <main className="pb-16 pt-28 md:pb-24 md:pt-36" data-testid={`leistung-page-${slug}`}>
        <div className="site-container max-w-3xl">
          <span className="eyebrow">{l.eyebrow}</span>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
            {l.h1}
          </h1>

          <div
            className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6"
            data-testid="leistung-answer-first"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              Kurzantwort
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-zinc-200">{l.answerFirst}</p>
          </div>

          <p className="mt-6 text-lg leading-relaxed text-zinc-400">{l.body}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
            <span className="rounded-full border border-white/12 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-zinc-300">
              {l.daysLabel}
            </span>
            <span className="text-zinc-300">{leistungPriceHint(l)}</span>
            <span className="text-zinc-600">· Tagessatz {company.dayRate} € netto</span>
          </div>

          <h2 className="mt-12 font-[family-name:var(--font-heading)] text-2xl font-light text-white">
            Was ist bei {l.shortTitle} enthalten?
          </h2>
          <ul className="mt-4 space-y-2.5" data-testid="leistung-features">
            {l.features.map((f) => (
              <li key={f} className="flex gap-2.5 text-sm text-zinc-300">
                <Check size={14} className="mt-0.5 shrink-0 text-zinc-400" aria-hidden />
                {f}
              </li>
            ))}
          </ul>

          <h2 className="mt-12 font-[family-name:var(--font-heading)] text-2xl font-light text-white">
            Welches Ergebnis liefert {l.shortTitle}?
          </h2>
          <ul className="mt-4 space-y-2.5" data-testid="leistung-outcomes">
            {l.outcomes.map((o) => (
              <li key={o} className="flex gap-2.5 text-sm text-zinc-300">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-500/60" />
                {o}
              </li>
            ))}
          </ul>

          <p className="mt-8 text-sm text-zinc-500">{l.locationNote}</p>
          <p className="mt-2 text-xs text-zinc-600">
            Primärbegriff: {l.primaryKeyword}. Ausschließlich B2B — keine Fake-Bewertungen.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={`/rueckruf?utm_source=leistungen&utm_medium=organic&utm_campaign=${slug}`}
              className="btn-primary inline-flex items-center gap-2"
              data-testid="leistung-cta-termin"
            >
              Termin buchen
              <ArrowRight className="size-4" />
            </Link>
            <Link href="/rueckruf?utm_source=leistungen&utm_medium=organic&utm_campaign=leistungen_rueckruf" className="btn-ghost" data-testid="leistung-cta-rueckruf-alt">
              Kostenlosen Rückruf
            </Link>
            <Link href="/preise?utm_source=leistungen&utm_medium=organic&utm_campaign=leistungen_preise" className="btn-ghost" data-testid="leistung-cta-preise">
              Preise
            </Link>
          </div>

          <h2 className="mt-16 font-[family-name:var(--font-heading)] text-2xl font-light text-white">
            Häufige Fragen zu {l.shortTitle} — direkt beantwortet
          </h2>
          <div className="mt-6 space-y-4" data-testid="leistung-faq">
            {l.faqs.map((f) => (
              <details
                key={f.q}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4"
              >
                <summary className="cursor-pointer font-medium text-zinc-200">{f.q}</summary>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{f.a}</p>
              </details>
            ))}
          </div>

          {l.branchen.length > 0 && (
            <section className="mt-14" data-testid="leistung-branchen-links">
              <h2 className="mt-12 font-[family-name:var(--font-heading)] text-2xl font-light text-white">
            In welchen Branchen ist {l.shortTitle} im Einsatz?
          </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {l.branchen.map((b) => (
                  <Link
                    key={b}
                    href={`/branchen/${b}`}
                    className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-white/25 hover:text-zinc-200"
                  >
                    {b}
                  </Link>
                ))}
                <Link
                  href="/branchen"
                  className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-300"
                >
                  alle Branchen
                </Link>
              </div>
            </section>
          )}

          <section className="mt-10" data-testid="leistung-vergleich-links">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-light text-white">
              Was unterscheidet {l.shortTitle} von Alternativen?
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/vergleich" className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200">
                Klassische IT vs NeXify
              </Link>
              <Link href="/preise?utm_source=leistungen&utm_medium=organic&utm_campaign=leistungen_preise" className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200">
                Preise & Tagessatz
              </Link>
            </div>
          </section>

          {related.length > 0 && (
            <section className="mt-10" data-testid="leistung-related">
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-light text-white">
                Welche Leistungen ergänzen {l.shortTitle}?
              </h2>
              <ul className="mt-4 space-y-2">
                {related.map((r) =>
                  r ? (
                    <li key={r.slug}>
                      <Link
                        href={`/leistungen/${r.slug}`}
                        className="text-sm text-zinc-300 underline-offset-4 hover:underline"
                      >
                        {r.shortTitle}
                      </Link>
                      <span className="text-zinc-600"> — {r.primaryKeyword}</span>
                    </li>
                  ) : null,
                )}
              </ul>
            </section>
          )}

          <p className="mt-12 text-sm text-zinc-600">
            <Link href="/leistungen" className="hover:text-zinc-400">
              ← Alle Leistungen
            </Link>
          </p>
        </div>
      </main>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={serviceJsonLd} />
    </>
  );
}
