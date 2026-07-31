import { pageMetadata, breadcrumbListJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { ServicesPage } from "@/components/pages/services";

export const metadata = pageMetadata({
  title: "Leistungen — Websites, Shops, Apps & AI-Automatisierung",
  description: "Acht klar definierte Leistungsbausteine: Landingpages, Websites, Onlineshops, Enterprise-Commerce, Web-Apps, Mobile Apps, Automatisierung und AI-Agenten. 449 € netto pro Arbeitstag.",
  path: "/leistungen",
  ogTitle: "Leistungen — Websites, Shops, Apps & AI | NeXify AI",
  ogDescription: "Acht Leistungsbausteine zum Tagessatz 449 € netto: Websites, Shops, Apps und AI-Automatisierung.",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Leistungen", path: "/leistungen" },
]);

export default function Page() {
  return (
    <>
      <ServicesPage />
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
