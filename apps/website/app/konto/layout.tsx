# FILE: /opt/nexifyai/repos/nexify-agentur-plattform/apps/website/app/konto/layout.tsx
# NIR: 02.08.2026 08:55
# UPDATED: 02.08.2026 08:55
# NAME: NeXifyAI Agent
# TEAM: NeXifyAI Dev
# WHAT: noindex/nofollow layout for the customer portal
# WHY: Private account UI must not be indexed despite public URL reachability
# BEST-PRACTICE: Mirror login/registrieren layouts — meta robots + robots.txt disallow
# PITFALL: V-SEO: client page.tsx cannot export metadata; layout must carry robots
# DEPENDS: Next.js Metadata API
# DOCS-REF: apps/website/lib/seo.ts, apps/website/app/robots.ts
# SESSION: seo-audit-2026-08-02

import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Konto",
};

export default function KontoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
