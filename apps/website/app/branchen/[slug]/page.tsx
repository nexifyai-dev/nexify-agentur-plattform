// FILE: /apps/website/app/branchen/[slug]/page.tsx
// NIR: 02.08.2026 10:50
// UPDATED: 08.08.2026 12:20
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Dynamic branchen landing — pain / outcome / audit CTA; M-08: Pain-Point-Sektion,
//       Anwendungsfälle (Chatbot/Automatisierung/Website), FAQPage- + Service-Schema, 3 CTAs
// WHY: Frewert-Muster Branchenpages; Competitor industry SEO pattern without copying copy
// BEST-PRACTICE: generateStaticParams; honest CTAs; data-testid; keine Fake-Metriken
// PITFALL: V-GTM-BR-03: 404 unknown slug; no invented metrics; kein Rechts-/Medizinrat
// DEPENDS: lib/gtm/branchen, company, /wissen-Artikel (M-05), /preise
// DOCS-REF: docs/gtm/STRONGEST-COMPETITORS-2026.md
// SESSION: t_0151f14a M-08

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

  const path = `/branchen/${slug}`;
  const breadcrumbJsonLd = breadcrumbListJsonLd([
    { name: "Home", path: "/" },
    { name: "Branchen", path: "/branchen" },
    { name: b.title.split("—")[0].trim(), path },
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
    name: b.title.split("—")[0].trim(),
    description: b.description,
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
      description: `Tagessatz ${company.dayRate} € netto · Audit 1 Tag · ausschließlich B2B`,
      url: `https://www.nexifyai.cloud${path}`,
    },
  };

  return (
    <>
      <main className="pb-16 pt-28 md:pb-24 md:pt-36" data-testid={`branche-page-${slug}`}>
        <div className="site-container max-w-3xl">
          <span className="eyebrow">{b.eyebrow}</span>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
            {b.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-400">{b.description}</p>

          <section
            className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6"
            data-testid="branche-not-your-fault"
          >
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-light text-white">
              Es ist nicht Ihre Schuld, dass …
            </h2>
            <ul className="mt-4 space-y-3">
              {b.notYourFault.map((n) => (
                <li key={n} className="flex gap-3 text-sm text-zinc-300">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-amber-500/60" />
                  {n}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-zinc-500">
              Diese Engpässe sind Struktur, nicht Versagen. Und Struktur lässt sich bauen.
            </p>
          </section>

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
            Konkrete Anwendung: {b.useCase.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-300" data-testid="branche-usecase">
            {b.useCase.text}
          </p>

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

          <h2 className="mt-12 font-[family-name:var(--font-heading)] text-2xl font-light text-white">
            Anwendungsfälle für {b.title.split("—")[0].trim()}
          </h2>
          <div className="mt-4 space-y-3" data-testid="branche-apps">
            {b.apps.map((app) => (
              <Link
                key={app.name}
                href={app.href}
                className="block rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 transition-colors hover:border-white/25"
              >
                <span className="text-sm font-bold uppercase tracking-widest text-zinc-200">
                  {app.name}
                </span>
                <span className="mt-1 block text-sm text-zinc-400">{app.text}</span>
              </Link>
            ))}
          </div>

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
              href={`/rueckruf?utm_source=branchen&utm_medium=organic&utm_campaign=${slug}`}
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
            <Link href="/preise" className="btn-ghost" data-testid="branche-cta-preise">
              Preise
            </Link>
          </div>

          <h2 className="mt-16 font-[family-name:var(--font-heading)] text-2xl font-light text-white">
            Häufige Fragen
          </h2>
          <div className="mt-6 space-y-4" data-testid="branche-faq">
            {b.faqs.map((f) => (
              <details
                key={f.q}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4"
              >
                <summary className="cursor-pointer font-medium text-zinc-200">{f.q}</summary>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{f.a}</p>
              </details>
            ))}
          </div>

          {b.wissen && (
            <p className="mt-8 text-sm text-zinc-500">
              <Link
                href={`/wissen/${b.wissen.slug}`}
                className="underline-offset-4 hover:text-zinc-300 hover:underline"
                data-testid="branche-wissen-link"
              >
                Weiterlesen: {b.wissen.title}
              </Link>
            </p>
          )}

          <p className="mt-12 text-sm text-zinc-600">
            <Link href="/branchen" className="hover:text-zinc-400" data-testid="branche-back">
              ← Alle Branchen
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
