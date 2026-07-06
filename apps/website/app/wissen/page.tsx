import type { Metadata } from "next";
import { KnowledgePage } from "@/components/pages/knowledge";

export const metadata: Metadata = {
  title: "Wissen — Einblicke in AI-gestützte Entwicklung",
  description: "Praxisnahe Artikel zu Websites, E-Commerce, AI-Agenten, Automatisierung, Technologie-Stack und DSGVO-konformer AI-Integration.",
};

export default function Page() {
  return <KnowledgePage />;
}
