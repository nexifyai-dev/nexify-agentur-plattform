/**
 * FILE: apps/website/lib/blog.ts
 * WHAT: Load Markdown blog posts from content/blog (frontmatter + body).
 * WHY: Agent-authored DE content without MDX build complexity; SSR crawlable.
 * DEPENDS: apps/website/content/blog/*.md
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  datePublished: string;
  dateModified: string;
  tag: string;
  readTime: string;
  /** Optional locale hint; acquisition content is DE-first. */
  locale?: "de" | "en" | "nl";
};

export type BlogPost = BlogPostMeta & {
  content: string;
};

const BLOG_DIR = join(process.cwd(), "content", "blog");

function parseFrontmatter(raw: string): { data: Record<string, string>; body: string } {
  const trimmed = raw.replace(/^\uFEFF/, "");
  if (!trimmed.startsWith("---")) {
    return { data: {}, body: trimmed.trim() };
  }
  const end = trimmed.indexOf("\n---", 3);
  if (end === -1) {
    return { data: {}, body: trimmed.trim() };
  }
  const fm = trimmed.slice(3, end).trim();
  const body = trimmed.slice(end + 4).replace(/^\n+/, "");
  const data: Record<string, string> = {};
  for (const line of fm.split("\n")) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    data[m[1]] = v;
  }
  return { data, body };
}

function fileToPost(filename: string): BlogPost | null {
  if (!filename.endsWith(".md")) return null;
  const slug = filename.replace(/\.md$/, "");
  const raw = readFileSync(join(BLOG_DIR, filename), "utf8");
  const { data, body } = parseFrontmatter(raw);
  if (!data.title || !data.description) return null;
  return {
    slug,
    title: data.title,
    description: data.description,
    excerpt: data.excerpt || data.description,
    datePublished: data.datePublished || data.date || "2026-08-02",
    dateModified: data.dateModified || data.datePublished || data.date || "2026-08-02",
    tag: data.tag || "Blog",
    readTime: data.readTime || "5 Min.",
    locale: (data.locale as BlogPostMeta["locale"]) || "de",
    content: body,
  };
}

export function getAllBlogPosts(): BlogPost[] {
  if (!existsSync(BLOG_DIR)) return [];
  const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  return files
    .map(fileToPost)
    .filter((p): p is BlogPost => p != null)
    .sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1));
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getAllBlogPosts().find((p) => p.slug === slug);
}

export function blogPostSlugs(): string[] {
  return getAllBlogPosts().map((p) => p.slug);
}
