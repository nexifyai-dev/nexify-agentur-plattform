// FILE: /apps/website/app/branchen/[slug]/page.tsx
// NIR: 02.08.2026 11:00
// UPDATED: 02.08.2026 11:00
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Per-ICP SEO landing
// WHY: Competitor-style branchen pages in NeXify voice
// BEST-PRACTICE: Static params; JSON-LD FAQ; no fake metrics
// PITFALL: V-BRANCHE-03: Comparison is pattern-based
// DEPENDS: lib/content/branchen, company, seo
// DOCS-REF: docs/gtm/COMPETITOR-PLAYBOOK-COPY.md
// SESSION: icp-demand-competitor-copy-7dd5

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { BRANCHEN, getBranche, branchenSlugs } from "@/lib/content/branchen";
import { company } from "@/lib/company";
import { absoluteUrl, breadcrumbListJsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return branchenSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const b = getBranche(slug);
  if (!b) return {};
  return pageMetadata({
    title: b.metaTitle,
    description: b.metaDescription,
    path: `/branchen/${b.slug}`,
    ogTitle: b.title,
    ogDescription: b.metaDescription,
  });
}

export default async function BranchePage({ params }: Props) {
  const { slug } = await params;
  const b = getBranche(slug);
  if (!b) notFound();

  const breadcrumbJsonLd = breadcrumbListJsonLd([
    { name: "Home", path: "/" },
    { name: "Branchen", path: "/branchen" },
    { name: b.title, path: `/branchen/${b.slug}` },
  ]);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: b.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: b.title,
    description: b.metaDescription,
    provider: { "@type": "Organization", name: company.brand, url: absoluteUrl("/") },
    areaServed: "DACH",
    url: absoluteUrl(`/branchen/${b.slug}`),
  };

  const others = BRANCHEN.filter((x) => x.slug !== b.slug).slice(0, 4);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={serviceJsonLd} />
      <main className="pb-16 pt-28 md:pb-24 md:pt-36" data-testid={`branchen-page-${b.slug}`}>
        <div className="site-container max-w-4xl">
          <span className="eyebrow">{b.eyebrow}</span>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">{b.headline}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400">{b.lead}</p>
          <p className="mt-3 text-sm text-zinc-500">Tagessatz {company.dayRate}&nbsp;€ netto · B2B only · persönlich: {company.owner}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/rueckruf?utm_source=branchen&utm_campaign=icp_${b.slug}`} className="btn-primary inline-flex items-center gap-2" data-testid={`branchen-${b.slug}-cta-book`}>Termin buchen <ArrowRight className="size-4" /></Link>
            <Link href="/checkliste" className="btn-ghost inline-flex items-center gap-2" data-testid={`branchen-${b.slug}-cta-checklist`}>Checkliste</Link>
            <Link href="/vergleich" className="btn-ghost inline-flex items-center gap-2" data-testid={`branchen-${b.slug}-cta-vergleich`}>Vergleich</Link>
          </div>
          <section className="mt-14" data-testid={`branchen-${b.slug}-pains`}>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-light text-white">Typische Engpässe</h2>
            <ul className="mt-5 space-y-3">
              {b.pains.map((p) => (
                <li key={p} className="flex gap-3 text-sm text-zinc-300">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-zinc-500" aria-hidden /><span>{p}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="mt-12" data-testid={`branchen-${b.slug}-outcomes`}>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-light text-white">Was Sie konkret bekommen</h2>
            <ul className="mt-5 space-y-3">
              {b.outcomes.map((o) => (
                <li key={o} className="flex gap-3 text-sm text-zinc-300">
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-400/80" aria-hidden /><span>{o}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="mt-12" data-testid={`branchen-${b.slug}-compare`}>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-light text-white">Typisch am Markt vs. NeXify AI</h2>
            <p className="mt-2 text-sm text-zinc-500">Mustervergleich — keine Aussage über einen namentlichen Wettbewerber.</p>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                    <th className="px-5 py-4 font-bold">Kriterium</th>
                    <th className="px-5 py-4 font-bold">Häufig am Markt</th>
                    <th className="px-5 py-4 font-bold text-white">NeXify AI</th>
                  </tr>
                </thead>
                <tbody>
                  {b.comparisonRows.map((r) => (
                    <tr key={r.label} className="border-b border-white/5 last:border-0">
                      <td className="px-5 py-4 font-medium text-zinc-300">{r.label}</td>
                      <td className="px-5 py-4 text-zinc-500">{r.typical}</td>
                      <td className="px-5 py-4 text-zinc-200">{r.nexify}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          {b.foerderHinweis ? (
            <p className="mt-8 text-xs leading-relaxed text-zinc-600" data-testid={`branchen-${b.slug}-foerder`}>{b.foerderHinweis}</p>
          ) : null}
          <section className="mt-14" data-testid={`branchen-${b.slug}-faq`}>
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-light text-white">FAQ</h2>
            <dl className="mt-6 space-y-6">
              {b.faqs.map((f) => (
                <div key={f.q}>
                  <dt className="text-sm font-medium text-zinc-200">{f.q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-zinc-500">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="mt-14 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-light text-white">Nächster Schritt</h2>
            <p className="mt-3 text-sm text-zinc-400">15 Minuten Rückruf — Engpass mit dem größten Hebel.</p>
            <Link href={`/rueckruf?utm_source=branchen&utm_campaign=icp_${b.slug}`} className="btn-primary mt-6 inline-flex items-center gap-2" data-testid={`branchen-${b.slug}-cta-book-bottom`}>Rückruf buchen <ArrowRight className="size-4" /></Link>
          </section>
          <nav className="mt-12" aria-label="Weitere Branchen">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">Weitere Branchen</p>
            <ul className="mt-4 flex flex-wrap gap-3">
              {others.map((o) => (
                <li key={o.slug}><Link href={`/branchen/${o.slug}`} className="text-sm text-zinc-400 underline-offset-4 hover:text-white hover:underline">{o.title}</Link></li>
              ))}
              <li><Link href="/branchen" className="text-sm text-zinc-400 underline-offset-4 hover:text-white hover:underline">Alle Branchen</Link></li>
            </ul>
          </nav>
        </div>
      </main>
    </>
  );
}
