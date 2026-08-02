import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { getAllBlogPosts } from "@/lib/blog";
import { breadcrumbListJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Blog — KI, Automatisierung & Web für DACH-KMU",
  description:
    "Praxisartikel zu KI-Automatisierung, Agentur-Kosten und Use-Cases für KMU in Deutschland, Österreich und der Schweiz — Sitz Venlo, Fokus DACH.",
  path: "/blog",
  ogTitle: "Blog | NeXify AI — DACH-Fokus",
  ogDescription:
    "DE-first Blog zu KI-Automatisierung, Kosten und regionalen Use-Cases (Venlo/NRW/DACH).",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog" },
]);

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <main className="pb-10 pt-28 md:pt-36" data-testid="blog-page">
        <div className="site-container">
          <span className="eyebrow">Blog · DACH</span>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
            KI, Web &amp; Automatisierung — klar für den Mittelstand
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Deutschsprachige Praxisbeiträge für KMU: Kosten, Use-Cases und Findbarkeit.
            Sitz in Venlo (NL), Primärmarkt DACH — ohne NL-Acquisition als Hauptpfad.
          </p>

          <div className="mt-6 flex flex-wrap gap-3" data-testid="blog-index-links">
            <Link
              href="/wissen"
              className="text-[13px] font-semibold text-zinc-400 transition-colors hover:text-white"
              data-testid="blog-link-wissen"
            >
              Auch unter Wissen
            </Link>
            <span className="text-zinc-700">·</span>
            <Link
              href="/blog/rss.xml"
              className="text-[13px] font-semibold text-zinc-400 transition-colors hover:text-white"
              data-testid="blog-link-rss"
            >
              RSS
            </Link>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2" data-testid="blog-post-grid">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="glass glass-lift flex h-full flex-col p-8"
                data-testid={`blog-card-${post.slug}`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-white/12 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    {post.tag}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] text-zinc-600">
                    <Clock3 size={12} /> {post.readTime}
                  </span>
                  <time className="text-[11px] text-zinc-600" dateTime={post.datePublished}>
                    {post.datePublished}
                  </time>
                </div>
                <h2 className="mt-5 font-[family-name:var(--font-heading)] text-xl font-medium leading-snug text-white">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="transition-colors hover:text-zinc-200"
                    data-testid={`blog-card-title-${post.slug}`}
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-zinc-500">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-zinc-300 transition-colors hover:text-white"
                  data-testid={`blog-card-read-${post.slug}`}
                >
                  Weiterlesen <ArrowRight size={14} />
                </Link>
              </article>
            ))}
          </div>

          <nav
            className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8"
            aria-label="Weiterführende Seiten"
            data-testid="blog-cta-band"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">
              Projekt anfragen
            </p>
            <p className="mt-3 max-w-xl text-[15px] text-zinc-400">
              Tagessatz 449 € netto — Aufwandsspanne vor Start. Kein Pitch-Theater.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/leistungen" className="btn-ghost !py-2.5 text-sm" data-testid="blog-cta-leistungen">
                Leistungen
              </Link>
              <Link href="/kontakt" className="btn-primary" data-testid="blog-cta-kontakt">
                Kontakt <ArrowRight size={14} className="ml-1 inline" />
              </Link>
            </div>
          </nav>
        </div>
      </main>
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
