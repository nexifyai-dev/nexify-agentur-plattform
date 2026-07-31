import { pageMetadata } from "@/lib/seo";
import { ServicesPage } from "@/components/pages/services";

export const metadata = pageMetadata({
  title: "Leistungen — Websites, Shops, Apps & AI-Automatisierung",
  description: "Acht klar definierte Leistungsbausteine: Landingpages, Websites, Onlineshops, Enterprise-Commerce, Web-Apps, Mobile Apps, Automatisierung und AI-Agenten. 449 € netto pro Arbeitstag.",
  path: "/leistungen",
  ogTitle: "Leistungen — Websites, Shops, Apps & AI | NeXify AI",
  ogDescription: "Acht Leistungsbausteine zum Tagessatz 449 € netto: Websites, Shops, Apps und AI-Automatisierung.",
});

export default function Page() {
  return <ServicesPage />;
}
