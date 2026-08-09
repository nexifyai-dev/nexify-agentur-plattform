import { pageMetadata, breadcrumbListJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { KnowledgePage } from "@/components/pages/knowledge";

export const metadata = pageMetadata({
  title: "Wissen — Einblicke in AI-gestützte Entwicklung | NeXify AI",
  description:
    "Praxisnahe Artikel zu Websites, E-Commerce, AI-Agenten, Automatisierung und Web-App-Kosten (449 € Tagessatz) — inkl. eigenständiger Beiträge unter /wissen/…",
  path: "/wissen",
  ogTitle: "Wissen — AI-gestützte Entwicklung | NeXify AI",
  ogDescription: "Praxisnahe Einblicke zu Websites, E-Commerce, AI-Agenten und Automatisierung.",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Wissen", path: "/wissen" },
]);

export default function Page() {
  return (
    <>
      <KnowledgePage />
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
