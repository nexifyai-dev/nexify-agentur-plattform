import { pageMetadata, breadcrumbListJsonLd, servicesOfferCatalogJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { ServicesPage } from "@/components/pages/services";
import { services } from "@/lib/site-data";

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

const servicesJsonLd = servicesOfferCatalogJsonLd(
  services.map((s) => ({
    slug: s.slug,
    name: s.shortTitle,
    description: s.description,
    minDays: s.minDays,
    maxDays: s.maxDays,
    from: s.from,
  })),
);

export default function Page() {
  return (
    <>
      <ServicesPage />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={servicesJsonLd} />
    </>
  );
}
