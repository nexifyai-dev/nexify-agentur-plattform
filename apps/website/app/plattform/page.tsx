import { pageMetadata, breadcrumbListJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { PlatformPage } from "@/components/pages/platform";

export const metadata = pageMetadata({
  title: "Plattform — Der Technik-Stack hinter der Geschwindigkeit | NeXify AI",
  description: "Next.js, React, TypeScript, Supabase, AI-Agenten und sichere EU-Infrastruktur: der kuratierte Technologie-Stack von NeXify AI – inklusive KI-Berater NeXify AI.",
  path: "/plattform",
  ogTitle: "Plattform & Tech-Stack | NeXify AI",
  ogDescription: "Next.js, React, TypeScript, Supabase und AI-Agenten — der Stack hinter der Geschwindigkeit.",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Plattform", path: "/plattform" },
]);

export default function Page() {
  return (
    <>
      <PlatformPage />
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
