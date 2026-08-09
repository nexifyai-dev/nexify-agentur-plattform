import { pageMetadata, breadcrumbListJsonLd, webPageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { LegalPageView } from "@/components/legal-page";

export const metadata = pageMetadata({
  title: "Impressum / Colofon | NeXify AI",
  description: "Anbieterkennzeichnung gemäß §§ 5, 6 DDG – NeXify AI, Venlo (NL).",
  path: "/impressum",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Impressum", path: "/impressum" },
]);

const pageJsonLd = webPageJsonLd({
  title: "Impressum | NeXify AI",
  description: "Anbieterkennzeichnung gemäß §§ 5, 6 DDG – NeXify AI, Venlo (NL).",
  path: "/impressum",
  dateModified: "2026-08-02",
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={pageJsonLd} />
      <LegalPageView slug="impressum" />
    </>
  );
}
