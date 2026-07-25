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
    // PR47 / Emergent SoT: marketing pages are UNPREFIXED (`/preise`, …).
    // Prior permanent redirects to `/de/*` forced the alternate `[locale]` tree
    // and suppressed the Emergent HomePage (Digitale Exzellenz / HeroVisual).
    // Locale-prefixed URLs are stripped in middleware → unprefixed destinations.
    { source: "/:locale(de|en|nl)/:page(login|admin|konto|registrieren|rueckruf)", destination: "/:page", permanent: false },
    // Legacy aliases → Emergent unprefixed paths (not /de/*)
    { source: "/arbeitsweise", destination: "/prozess", permanent: true },
    { source: "/ueber-pascal", destination: "/ueber-mich", permanent: true },
    { source: "/projekte", destination: "/referenzen", permanent: true },
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
