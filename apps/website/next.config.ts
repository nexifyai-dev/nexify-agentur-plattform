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
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    },
  ],
  redirects: async () => [
    { source: "/arbeitsweise", destination: "/prozess", permanent: true },
    { source: "/ueber-pascal", destination: "/ueber-mich", permanent: true },
    { source: "/projekte", destination: "/referenzen", permanent: true },
    { source: "/leistungen/unternehmenswebsites", destination: "/leistungen/websites", permanent: true },
    { source: "/leistungen/ai-gestuetzte-agenten", destination: "/leistungen/ai-agenten", permanent: true },
  ],
  rewrites: async () =>
    process.env.BACKEND_ORIGIN
      ? [{ source: "/api/:path*", destination: `${process.env.BACKEND_ORIGIN}/api/:path*` }]
      : [],
};

export default nextConfig;
