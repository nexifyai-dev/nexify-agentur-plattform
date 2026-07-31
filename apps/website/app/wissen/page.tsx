import { pageMetadata } from "@/lib/seo";
import { KnowledgePage } from "@/components/pages/knowledge";

export const metadata = pageMetadata({
  title: "Wissen — Einblicke in AI-gestützte Entwicklung",
  description: "Praxisnahe Artikel zu Websites, E-Commerce, AI-Agenten, Automatisierung, Technologie-Stack und DSGVO-konformer AI-Integration.",
  path: "/wissen",
  ogTitle: "Wissen — AI-gestützte Entwicklung | NeXify AI",
  ogDescription: "Praxisnahe Einblicke zu Websites, E-Commerce, AI-Agenten und Automatisierung.",
});

export default function Page() {
  return <KnowledgePage />;
}
