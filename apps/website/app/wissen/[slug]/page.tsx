import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import {
  WISSEN_ARTICLES,
  getWissenArticle,
  wissenArticleSlugs,
} from "@/lib/content/wissen-articles";
import { articleJsonLd, breadcrumbListJsonLd, pageMetadata } from "@/lib/seo";
import { getWissenSections } from "@/lib/content/wissen-sections";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return wissenArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = getWissenArticle(slug);
  if (!article) return {};
  return pageMetadata({
    title: `${article.title} — Wissen | NeXify AI`,
    description: article.description,
    path: `/wissen/${article.slug}`,
    ogTitle: `${article.title} | NeXify AI`,
    ogDescription: article.excerpt,
  });
}

/**
 * Rendert [Label](/pfad) innerhalb eines Absatzes als interne Next-Links.
 * WHY: Interne Verlinkung (M-05-Pflicht, min. 3 je Artikel) ohne HTML-Konstrukte
 * im Content — Link-Label bleiben Crawlbar, Kaputte-Pfade fallen im Build nicht auf.
 */
function renderParagraph(text: string, key: number) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return (
    <p key={key} className="text-[15.5px] leading-[1.85] text-zinc-300">
      {parts.map((part, i) => {
        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (!m) return <span key={i}>{part}</span>;
        return (
          <Link
            key={i}
            href={m[2]}
            className="font-medium text-zinc-200 underline decoration-zinc-600 underline-offset-4 transition-colors hover:text-white hover:decoration-zinc-300"
            data-testid={`wissen-body-link-${m[2].replace(/[^a-z0-9-]/gi, "")}`}
          >
            {m[1]}
          </Link>
        );
      })}
    </p>
  );
}

export default async function WissenArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getWissenArticle(slug);
  if (!article) notFound();

  const path = `/wissen/${article.slug}`;
  const sections = getWissenSections(article.slug);
  const breadcrumbJsonLd = breadcrumbListJsonLd([
    { name: "Home", path: "/" },
    { name: "Wissen", path: "/wissen" },
    { name: article.title, path },
  ]);
  const articleSchema = articleJsonLd({
    title: article.title,
    description: article.description,
    path,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
  });

  const faqJsonLd = article.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: article.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  const others = WISSEN_ARTICLES.filter((a) => a.slug !== article.slug);

  return (
    <>
      <main className="pb-10 pt-28 md:pt-36" data-testid={`wissen-article-${article.slug}`}>
        <article className="site-container max-w-3xl">
          <Link
            href="/wissen"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-zinc-400 transition-colors hover:text-white"
            data-testid="wissen-back"
          >
            <ArrowLeft size={14} /> Zurück zu Wissen
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/12 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {article.tag}
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-zinc-600">
              <Clock3 size={12} /> {article.readTime}
            </span>
            <time
              className="text-[11px] text-zinc-600"
              dateTime={article.datePublished}
            >
              {article.datePublished}
            </time>
            <span
              className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500"
              data-testid="wissen-last-updated"
            >
              Aktualisiert: {article.dateModified}
            </span>
          </div>

          <h1 className="mt-5 font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-400">{article.excerpt}</p>

          <div className="mt-10 space-y-5 border-t border-white/10 pt-8">
            {sections.length ? (
              <>
                {sections.map((s, i) => (
                  <section key={i} className="space-y-3">
                    <h2
                      className="pt-4 font-[family-name:var(--font-heading)] text-2xl font-light tracking-tight text-white"
                      data-testid={`wissen-section-h2-${i}`}
                    >
                      {s.h2}
                    </h2>
                    <p className="text-[15.5px] leading-[1.85] text-zinc-300">{s.answer}</p>
                  </section>
                ))}
                <div className="mt-8 space-y-5 border-t border-white/10 pt-8">
                  {article.body.map((paragraph, i) => renderParagraph(paragraph, i))}
                </div>
              </>
            ) : (
              article.body.map((paragraph, i) => renderParagraph(paragraph, i))
            )}
          </div>

          {article.faqs?.length ? (
            <section
              className="mt-12 border-t border-white/10 pt-8"
              aria-label="Häufige Fragen"
              data-testid="wissen-faq"
            >
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-medium text-white">
                Häufige Fragen
              </h2>
              <div className="mt-4 space-y-4">
                {article.faqs.map((f, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
                    data-testid={`wissen-faq-item-${i}`}
                  >
                    <h3 className="text-[15px] font-semibold text-white">{f.q}</h3>
                    <p className="mt-2 text-[14px] leading-[1.75] text-zinc-400">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {article.cta ? (
            <div className="mt-10 text-center" data-testid="wissen-cta">
              <Link href={article.cta.href} className="btn-primary" data-testid="wissen-cta-button">
                {article.cta.label} <ArrowRight size={14} className="ml-1 inline" />
              </Link>
            </div>
          ) : null}

          <nav
            className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8"
            aria-label="Weiterführende Seiten"
            data-testid="wissen-internal-links"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">
              Weiterlesen &amp; anfragen
            </p>
            <ul className="mt-4 flex flex-wrap gap-3">
              <li>
                <Link
                  href="/preise?utm_source=wissen&utm_medium=organic&utm_campaign=wissen_preise"
                  className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-[13px] font-semibold text-zinc-300 transition-colors hover:border-white/25 hover:text-white"
                  data-testid="wissen-link-preise"
                >
                  Preise (449 €)
                </Link>
              </li>
              <li>
                <Link
                  href="/leistungen"
                  className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-[13px] font-semibold text-zinc-300 transition-colors hover:border-white/25 hover:text-white"
                  data-testid="wissen-link-leistungen"
                >
                  Leistungen
                </Link>
              </li>
              <li>
                <Link href="/kontakt?utm_source=wissen&utm_medium=organic&utm_campaign=wissen_kontakt" className="btn-primary" data-testid="wissen-link-kontakt">
                  Kontakt <ArrowRight size={14} className="ml-1 inline" />
                </Link>
              </li>
            </ul>
          </nav>

          {others.length > 0 && (
            <aside className="mt-12 border-t border-white/10 pt-8">
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-medium text-white">
                Weitere Artikel
              </h2>
              <ul className="mt-4 space-y-3">
                {others.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/wissen/${a.slug}`}
                      className="text-[15px] font-medium text-zinc-300 transition-colors hover:text-white"
                    >
                      {a.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </article>
      </main>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={articleSchema} />
      {faqJsonLd ? <JsonLd data={faqJsonLd} /> : null}
    </>
  );
}
