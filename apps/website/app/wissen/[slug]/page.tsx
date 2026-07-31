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

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return wissenArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = getWissenArticle(slug);
  if (!article) return {};
  return pageMetadata({
    title: `${article.title} — Wissen`,
    description: article.description,
    path: `/wissen/${article.slug}`,
    ogTitle: `${article.title} | NeXify AI`,
    ogDescription: article.excerpt,
  });
}

export default async function WissenArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getWissenArticle(slug);
  if (!article) notFound();

  const path = `/wissen/${article.slug}`;
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
          </div>

          <h1 className="mt-5 font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-400">{article.excerpt}</p>

          <div className="mt-10 space-y-5 border-t border-white/10 pt-8">
            {article.body.map((paragraph, i) => (
              <p key={i} className="text-[15.5px] leading-[1.85] text-zinc-300">
                {paragraph}
              </p>
            ))}
          </div>

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
                  href="/preise"
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
                <Link href="/kontakt" className="btn-primary" data-testid="wissen-link-kontakt">
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
    </>
  );
}
