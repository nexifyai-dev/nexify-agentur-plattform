import { getAllBlogPosts } from "@/lib/blog";
import { absoluteUrl, siteOrigin } from "@/lib/seo";

export const dynamic = "force-static";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = getAllBlogPosts();
  const origin = siteOrigin();
  const items = posts
    .map((p) => {
      const link = absoluteUrl(`/blog/${p.slug}`);
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <pubDate>${new Date(p.datePublished).toUTCString()}</pubDate>
      <description>${escapeXml(p.description)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NeXify AI Blog — DACH</title>
    <link>${escapeXml(absoluteUrl("/blog"))}</link>
    <description>KI-Automatisierung, Web und Agentur-Praxis für KMU im DACH-Raum.</description>
    <language>de-de</language>
    <atom:link href="${escapeXml(absoluteUrl("/blog/rss.xml"))}" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
