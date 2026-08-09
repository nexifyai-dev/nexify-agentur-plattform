import { pageMetadata, breadcrumbListJsonLd, webPageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { LegalPageView } from "@/components/legal-page";

export const metadata = pageMetadata({
  title: "Datenschutzerklärung / Privacyverklaring | NeXify AI",
  description: "Informationspflichten nach Art. 12–14 DSGVO für Website, KI-Chat und B2B-Anfragen.",
  path: "/datenschutz",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Datenschutzerklärung", path: "/datenschutz" },
]);

const pageJsonLd = webPageJsonLd({
  title: "Datenschutzerklärung | NeXify AI",
  description: "Informationspflichten nach Art. 12–14 DSGVO für Website, KI-Chat und B2B-Anfragen.",
  path: "/datenschutz",
  dateModified: "2026-08-02",
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={pageJsonLd} />
      <LegalPageView slug="datenschutz" />
    </>
  );
}
