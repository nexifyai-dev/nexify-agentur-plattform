import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react";
import { BlogMarkdown } from "@/components/blog-markdown";
import { JsonLd } from "@/components/json-ld";
import { blogPostSlugs, getAllBlogPosts, getBlogPost } from "@/lib/blog";
import {
  blogPostingJsonLd,
  breadcrumbListJsonLd,
  pageMetadata,
} from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPostSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return pageMetadata({
    title: `${post.title} — Blog`,
    description: post.description,
    path: `/blog/${post.slug}`,
    ogTitle: `${post.title} | NeXify AI`,
    ogDescription: post.excerpt,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const path = `/blog/${post.slug}`;
  const breadcrumbJsonLd = breadcrumbListJsonLd([
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path },
  ]);
  const articleSchema = blogPostingJsonLd({
    title: post.title,
    description: post.description,
    path,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
  });

  const others = getAllBlogPosts().filter((p) => p.slug !== post.slug).slice(0, 4);

  return (
    <>
      <main className="pb-10 pt-28 md:pt-36" data-testid={`blog-article-${post.slug}`}>
        <article className="site-container max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-zinc-400 transition-colors hover:text-white"
            data-testid="blog-back"
          >
            <ArrowLeft size={14} /> Zurück zum Blog
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
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

          <h1 className="mt-5 font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-400">{post.excerpt}</p>

          <div className="mt-10 border-t border-white/10 pt-2">
            <BlogMarkdown content={post.content} />
          </div>

          <nav
            className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8"
            aria-label="Weiterführende Seiten"
            data-testid="blog-internal-links"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">
              Weiterlesen &amp; anfragen
            </p>
            <ul className="mt-4 flex flex-wrap gap-3">
              <li>
                <Link
                  href="/preise"
                  className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-[13px] font-semibold text-zinc-300 transition-colors hover:border-white/25 hover:text-white"
                  data-testid="blog-link-preise"
                >
                  Preise (449 €)
                </Link>
              </li>
              <li>
                <Link
                  href="/leistungen"
                  className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-[13px] font-semibold text-zinc-300 transition-colors hover:border-white/25 hover:text-white"
                  data-testid="blog-link-leistungen"
                >
                  Leistungen
                </Link>
              </li>
              <li>
                <Link href="/wissen" className="inline-flex items-center rounded-full border border-white/12 px-4 py-2 text-[13px] font-semibold text-zinc-300 transition-colors hover:border-white/25 hover:text-white" data-testid="blog-link-wissen">
                  Wissen
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="btn-primary" data-testid="blog-link-kontakt">
                  Kontakt <ArrowRight size={14} className="ml-1 inline" />
                </Link>
              </li>
            </ul>
          </nav>

          {others.length > 0 && (
            <aside className="mt-12 border-t border-white/10 pt-8" data-testid="blog-related">
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-medium text-white">
                Weitere Artikel
              </h2>
              <ul className="mt-4 space-y-3">
                {others.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/blog/${a.slug}`}
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
