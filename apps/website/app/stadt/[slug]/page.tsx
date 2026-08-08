// FILE: /apps/website/app/stadt/[slug]/page.tsx
// NIR: 08.08.2026 11:52
// UPDATED: 08.08.2026 11:52
// NAME: NeXifyAI Agent
// TEAM: NeXifyAI GTM
// WHAT: Generische Stadt-Landingpage (M-03): LocalBusiness-Schema, Breadcrumb,
//       FAQ, 3 CTAs mit UTM, interne Links zu /leistungen und /branchen
// WHY: Frewert-Muster: "[Leistung] [Stadt] » Gratis Seitenaudit" Longtail-Local-SEO;
//       Massen-Generierung ueber Registry statt Handseiten
// BEST-PRACTICE: generateStaticParams + notFound; ehrlich remote (kein Fake-Buero);
//       LocalBusiness mit Venlo-Sitz, areaServed = Stadt; kein Fake-AggregateRating
// PITFALL: V-SEO-L01 (kein Fake-Filialnetz); unbekannter Slug -> 404
// DEPENDS: lib/gtm/stadt-seo (Content), lib/seo, components/json-ld, company
// DOCS-REF: docs/gtm/MASSNAHMENKATALOG-2026-08-08.md M-03

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { company } from "@/lib/company";
import { getStadt, getStadtContent, stadtSlugs } from "@/lib/gtm/stadt-seo";
import { breadcrumbListJsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return stadtSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const stadt = getStadt(slug);
  const content = getStadtContent(slug);
  if (!stadt || !content) return {};
  return pageMetadata({
    title: `KI-Agentur ${stadt.name} » Gratis KI-Audit | NeXify AI`,
    description: content.intro.slice(0, 155),
    path: `/stadt/${slug}`,
    ogTitle: content.h1,
    ogDescription: content.localNote.slice(0, 160),
  });
}

export default async function StadtPage({ params }: Props) {
  const { slug } = await params;
  const stadt = getStadt(slug);
  const content = getStadtContent(slug);
  if (!stadt || !content) notFound();

  const path = `/stadt/${slug}`;
  const utm = `utm_source=stadtseite&utm_medium=organic&utm_campaign=${slug}`;

  const breadcrumbJsonLd = breadcrumbListJsonLd([
    { name: "Home", path: "/" },
    { name: "KI-Agentur", path: "/ki-agentur" },
    { name: stadt.name, path },
  ]);

  // LocalBusiness mit ehrlichem Sitz Venlo — keine erfundene Adresse in der Stadt.
  const localJsonLd = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    name: company.legalName,
    brand: company.brand,
    url: `https://www.nexifyai.cloud${path}`,
    email: company.email,
    telephone: company.phone,
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address,
      postalCode: "5921 JA",
      addressLocality: "Venlo",
      addressRegion: "Limburg",
      addressCountry: "NL",
    },
    areaServed: [
      { "@type": "City", name: stadt.name },
      { "@type": "Country", name: "Germany" },
      { "@type": "Country", name: "Austria" },
      { "@type": "Country", name: "Switzerland" },
      { "@type": "Country", name: "Netherlands" },
    ],
    makesOffer: {
      "@type": "Offer",
      price: String(company.dayRate),
      priceCurrency: "EUR",
      description: "Tagessatz netto pro Arbeitstag",
      unitText: "DAY",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <main className="pb-16 pt-28 md:pb-24 md:pt-36" data-testid={`stadt-page-${slug}`}>
        <div className="site-container max-w-3xl">
          <span className="eyebrow">KI-Agentur · {stadt.name}</span>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
            {content.h1}
          </h1>

          <div
            className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6"
            data-testid="stadt-intro"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              Remote-first für {stadt.name}
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-zinc-200">{content.intro}</p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3" data-testid="stadt-ctas">
            <Link
              href={`/audit?${utm}`}
              className="btn-primary inline-flex items-center gap-2"
              data-testid="stadt-cta-audit"
            >
              Gratis KI-Audit
              <ArrowRight className="size-4" />
            </Link>
            <Link href={`/preise?${utm}`} className="btn-ghost" data-testid="stadt-cta-preise">
              AI-Projektplaner
            </Link>
            <Link href={`/kontakt?${utm}`} className="btn-ghost" data-testid="stadt-cta-kontakt">
              Kontakt
            </Link>
          </div>

          <h2 className="mt-14 font-[family-name:var(--font-heading)] text-2xl font-light text-white">
            Leistungen für Unternehmen in {stadt.name}
          </h2>
          <div className="mt-6 space-y-4" data-testid="stadt-services">
            {content.services.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <h3 className="flex items-center gap-2 font-medium text-zinc-100">
                  <Check size={15} className="shrink-0 text-emerald-500/70" aria-hidden />
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.text}</p>
              </div>
            ))}
          </div>

          <section className="mt-14 rounded-2xl border border-white/10 bg-white/[0.03] p-6" data-testid="stadt-local-note">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-light text-white">
              So arbeiten wir mit {stadt.name} zusammen
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{content.localNote}</p>
          </section>

          <section className="mt-14" data-testid="stadt-internal-links">
            <h2 className="font-[family-name:var(--font-heading)] text-xl font-light text-white">
              Mehr zu unseren Leistungen & Branchen
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/leistungen"
                className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-white/25 hover:text-zinc-200"
              >
                Alle Leistungen
              </Link>
              <Link
                href="/branchen"
                className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-white/25 hover:text-zinc-200"
              >
                Alle Branchen
              </Link>
              <Link
                href="/ki-agentur"
                className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-white/25 hover:text-zinc-200"
              >
                KI-Agentur Übersicht
              </Link>
            </div>
          </section>

          <h2 className="mt-14 font-[family-name:var(--font-heading)] text-2xl font-light text-white">
            Häufige Fragen zu KI-Agentur {stadt.name}
          </h2>
          <div className="mt-6 space-y-4" data-testid="stadt-faq">
            {content.faqs.map((f) => (
              <details
                key={f.q}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4"
              >
                <summary className="cursor-pointer font-medium text-zinc-200">{f.q}</summary>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              href={`/audit?${utm}`}
              className="btn-primary inline-flex items-center gap-2"
              data-testid="stadt-cta-audit-bottom"
            >
              Gratis KI-Audit starten
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <p className="mt-10 text-sm text-zinc-600">
            <Link href="/ki-agentur" className="hover:text-zinc-400">
              ← Alle Städte & Regionen
            </Link>
          </p>
        </div>
      </main>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={localJsonLd} />
      <JsonLd data={faqJsonLd} />
    </>
  );
}
