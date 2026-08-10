import type { NextConfig } from "next";

const isVercelBuild = process.env.VERCEL === "1" || process.env.VERCEL === "true";

const nextConfig: NextConfig = {
  // Vercel does not need Next standalone output. Keeping it enabled there
  // breaks Next 16.3.0 post-build tracing because Vercel expects a root
  // .next/next-server.js.nft.json that the new build no longer emits.
  // Self-hosted/Docker builds still produce .next/standalone.
  output: isVercelBuild ? undefined : "standalone",
  reactStrictMode: true,
  allowedDevOrigins: [
    "rebranding-hub-2.preview.emergentagent.com",
    "rebranding-hub-2.cluster-12.preview.emergentcf.cloud",
    "*.preview.emergentagent.com",
    "*.preview.emergentcf.cloud",
  ],
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "X-DNS-Prefetch-Control", value: "on" },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        { key: "X-XSS-Protection", value: "1; mode=block" },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self' data:",
            "connect-src 'self' https:",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "object-src 'none'",
            "upgrade-insecure-requests",
          ].join("; "),
        },
      ],
    },
    {
      source: "/fonts/(.*)",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    },
    {
      source: "/llms.txt",
      headers: [
        { key: "Content-Type", value: "text/plain; charset=utf-8" },
        { key: "Cache-Control", value: "public, max-age=3600" },
      ],
    },
    {
      source: "/.well-known/llms.txt",
      headers: [
        { key: "Content-Type", value: "text/plain; charset=utf-8" },
        { key: "Cache-Control", value: "public, max-age=3600" },
      ],
    },
    {
      source: "/llm.txt",
      headers: [
        { key: "Content-Type", value: "text/plain; charset=utf-8" },
        { key: "Cache-Control", value: "public, max-age=3600" },
      ],
    },
  ],
  redirects: async () => [
    // apex → www (konsistente Domain, Hosting auf VPS seit 2026-08-10)
    { source: "/:path*", has: [{ type: "host", value: "nexifyai.cloud" }], destination: "https://www.nexifyai.cloud/:path*", permanent: true },
    // Locale-prefixed → unprefixed (Seiten existieren direkt, nicht in [locale])
    { source: "/:locale(de|en|nl)/:page(login|admin|konto|registrieren|rueckruf)", destination: "/:page", permanent: false },
    // EN/NL main pages redirect to direct DE versions (keine locale-Varianten)
    { source: "/:locale(en|nl)/:page(wissen|status|security|barrierefreiheit|sla|botschafter|branchen|checkliste|ki-agentur|partner|sprechstunde|venlo|alternativen|audit|danke)", destination: "/:page", permanent: false },
    // Legacy aliases → Emergent unprefixed paths
    { source: "/arbeitsweise", destination: "/prozess", permanent: true },
    { source: "/ueber-pascal", destination: "/ueber-mich", permanent: true },
    { source: "/projekte", destination: "/referenzen", permanent: true },
    { source: "/hilfe", destination: "/faq", permanent: true },
    { source: "/help", destination: "/faq", permanent: true },
    { source: "/docs", destination: "/wissen", permanent: true },
    { source: "/cookies", destination: "/cookie-richtlinie", permanent: true },
    { source: "/ki", destination: "/ki-hinweise", permanent: true },
    { source: "/dpa", destination: "/avv", permanent: true },
    { source: "/nutzungsbedingungen", destination: "/agb", permanent: true },
    { source: "/terms", destination: "/en/agb", permanent: true },
    { source: "/terms-and-conditions", destination: "/en/agb", permanent: true },
    { source: "/voorwaarden", destination: "/nl/agb", permanent: true },
    { source: "/thank-you", destination: "/danke", permanent: true },
    { source: "/thanks", destination: "/danke", permanent: true },
    { source: "/demo-call", destination: "https://calendly.com/pascal-courbois/30min", permanent: false },
  ],
  rewrites: async () => {
    const rewrites: { source: string; destination: string }[] = [
      { source: "/docs/vollbetrieb", destination: "/docs/vollbetrieb.md" },
    ];
    const origin = (process.env.BACKEND_ORIGIN || "").trim().replace(/\/$/, "");
    let usable = false;
    try {
      const u = new URL(origin);
      usable = (u.protocol === "http:" || u.protocol === "https:") && Boolean(u.hostname);
    } catch {
      usable = false;
    }
    if (usable) {
      rewrites.push({ source: "/api/:path*", destination: `${origin}/api/:path*` });
    }
    return rewrites;
  },
};

export default nextConfig;
