import { WISSEN_ARTICLES } from "@/lib/content/wissen-articles";

export const dynamic = "force-static";

const SITE = "https://www.nexifyai.cloud";

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function GET() {
  const items = WISSEN_ARTICLES.map((a) => {
    const link = `${SITE}/wissen/${a.slug}`;
    const pubDate = new Date(a.datePublished).toUTCString();
    const desc = esc(a.description || a.excerpt || "");
    return `    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${desc}]]></description>
    </item>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NeXify AI – Wissen</title>
    <link>${SITE}/wissen</link>
    <description>Fachartikel zu KI-Automatisierung für KMU – NeXify AI by NeXify (AUTOMATE IT.)</description>
    <language>de</language>
    <atom:link href="${SITE}/wissen/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
