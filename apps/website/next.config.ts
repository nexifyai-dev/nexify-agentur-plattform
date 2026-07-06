import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
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
};

export default nextConfig;
