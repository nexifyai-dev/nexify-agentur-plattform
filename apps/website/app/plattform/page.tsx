import { pageMetadata } from "@/lib/seo";
import { PlatformPage } from "@/components/pages/platform";

export const metadata = pageMetadata({
  title: "Plattform — Der Technik-Stack hinter der Geschwindigkeit",
  description: "Next.js, React, TypeScript, Supabase, AI-Agenten und sichere EU-Infrastruktur: der kuratierte Technologie-Stack von NeXify AI – inklusive KI-Berater NOVA.",
  path: "/plattform",
  ogTitle: "Plattform & Tech-Stack | NeXify AI",
  ogDescription: "Next.js, React, TypeScript, Supabase und AI-Agenten — der Stack hinter der Geschwindigkeit.",
});

export default function Page() {
  return <PlatformPage />;
}
