import { pageMetadata, breadcrumbListJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { ReferencesPage } from "@/components/pages/references";

export const metadata = pageMetadata({
  title: "Referenzen — Ergebnisse aus Web, Commerce & Automatisierung",
  description: "Anonymisierte Projektergebnisse: Websites in 3 Tagen, Commerce mit 60.000+ Artikeln, 70 % weniger manuelle Arbeit durch AI-Automatisierung.",
  path: "/referenzen",
  ogTitle: "Referenzen — Web, Commerce & AI-Automatisierung | NeXify AI",
  ogDescription: "Projektergebnisse: Websites in Tagen, Commerce mit 60.000+ Artikeln, spürbare Automation-Effekte.",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Referenzen", path: "/referenzen" },
]);

export default function Page() {
  return (
    <>
      <ReferencesPage />
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
