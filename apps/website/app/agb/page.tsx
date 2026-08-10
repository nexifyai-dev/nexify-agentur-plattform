import { pageMetadata, breadcrumbListJsonLd, webPageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { LegalPageView } from "@/components/legal-page";

export const metadata = pageMetadata({
  title: "AGB (B2B) / Algemene voorwaarden",
  description: "Allgemeine Geschäftsbedingungen für B2B-Leistungen von NeXify AI.",
  path: "/agb",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "AGB (B2B)", path: "/agb" },
]);

const pageJsonLd = webPageJsonLd({
  title: "AGB (B2B)",
  description: "Allgemeine Geschäftsbedingungen für B2B-Leistungen von NeXify AI.",
  path: "/agb",
  dateModified: "2026-08-02",
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={pageJsonLd} />
      <LegalPageView slug="agb" />
    </>
  );
}
