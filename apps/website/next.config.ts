import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
          // Pragmatic CSP: keeps Next.js' inline bootstrap and the inline JSON-LD
          // working (no nonce infra yet, so 'unsafe-inline' is required), while
          // locking down the high-value directives. Tighten script-src to a nonce
          // once a CSP nonce is wired through middleware.
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
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
  ],
  redirects: async () => [
    // Auth/utility pages live OUTSIDE the locale tree. An earlier middleware
    // version redirected /login → /de/login (404) and Vercel's edge cached
    // those 404s — send locale-prefixed auth URLs back to the real pages so
    // stale links and caches recover. Non-permanent on purpose (cheap to undo).
    { source: "/:locale(de|en|nl)/:page(login|admin|konto|registrieren|rueckruf)", destination: "/:page", permanent: false },
    // Legacy redirects (old URLs → /de/ prefixed)
    { source: "/arbeitsweise", destination: "/de/prozess", permanent: true },
    { source: "/ueber-pascal", destination: "/de/ueber-mich", permanent: true },
    { source: "/projekte", destination: "/de/referenzen", permanent: true },
    { source: "/leistungen/:slug", destination: "/de/leistungen/:slug", permanent: true },
    { source: "/preise", destination: "/de/preise", permanent: true },
    { source: "/kontakt", destination: "/de/kontakt", permanent: true },
    { source: "/prozess", destination: "/de/prozess", permanent: true },
    { source: "/ueber-mich", destination: "/de/ueber-mich", permanent: true },
    { source: "/faq", destination: "/de/faq", permanent: true },
    { source: "/referenzen", destination: "/de/referenzen", permanent: true },
    { source: "/plattform", destination: "/de/plattform", permanent: true },
    { source: "/wissen", destination: "/de/wissen", permanent: true },
    { source: "/impressum", destination: "/de/impressum", permanent: true },
    { source: "/datenschutz", destination: "/de/datenschutz", permanent: true },
    { source: "/agb", destination: "/de/agb", permanent: true },
    { source: "/ki-hinweise", destination: "/de/ki-hinweise", permanent: true },
    { source: "/cookie-richtlinie", destination: "/de/cookie-richtlinie", permanent: true },
    { source: "/avv", destination: "/de/avv", permanent: true },
    { source: "/widerruf", destination: "/de/widerruf", permanent: true },
  ],
  rewrites: async () => {
    const rewrites = [
      { source: "/docs/vollbetrieb", destination: "/docs/vollbetrieb.md" },
    ];
    if (process.env.BACKEND_ORIGIN) {
      rewrites.push({ source: "/api/:path*", destination: `${process.env.BACKEND_ORIGIN}/api/:path*` });
    }
    return rewrites;
  },
};

export default nextConfig;
