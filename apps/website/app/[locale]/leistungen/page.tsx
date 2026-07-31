import { pageMetadata } from "@/lib/seo";
import { ServicesPage } from "@/components/pages/services";

/** Safety net: Emergent SoT page if locale prefix is not stripped. */
export const metadata = pageMetadata({
  title: "Leistungen — Websites, Shops, Apps & AI-Automatisierung",
  description: "Acht klar definierte Leistungsbausteine: Landingpages, Websites, Onlineshops, Enterprise-Commerce, Web-Apps, Mobile Apps, Automatisierung und AI-Agenten. 449 € netto pro Arbeitstag.",
  path: "/leistungen",
});

export default function Page() {
  return <ServicesPage />;
}
