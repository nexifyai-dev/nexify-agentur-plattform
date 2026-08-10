import { pageMetadata, breadcrumbListJsonLd, servicesOfferCatalogJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { ServicesPage } from "@/components/pages/services";
import { LeistungenExtended } from "@/components/leistungen-extended";
import { services } from "@/lib/site-data";

export const metadata = pageMetadata({
  title: "Leistungen — Websites, Shops, Apps, KI & Automatisierung",
  description: "Alle NeXify Leistungen: Landingpages, Websites, Shops, Web-Apps, Mobile Apps, Automatisierung, AI-Agenten, KI-Begleiter, Portal, Beratung, Workshops, White-Label. 449 € netto/Tag.",
  path: "/leistungen",
  ogTitle: "Leistungen — Websites, Shops, Apps & AI | NeXify AI",
  ogDescription: "Vollständige Leistungsübersicht zum Tagessatz 449 € netto — dedizierte SEO-Seiten je Angebot.",
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
      <LeistungenExtended />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={servicesJsonLd} />
    </>
  );
}
