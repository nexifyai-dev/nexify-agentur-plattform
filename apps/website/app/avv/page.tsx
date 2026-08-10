import { pageMetadata, breadcrumbListJsonLd, webPageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { LegalPageView } from "@/components/legal-page";

export const metadata = pageMetadata({
  title: "AVV / Verwerkersovereenkomst",
  description: "Auftragsverarbeitung nach Art. 28 DSGVO – Struktur und Grundsätze.",
  path: "/avv",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "AVV", path: "/avv" },
]);

const pageJsonLd = webPageJsonLd({
  title: "AVV",
  description: "Auftragsverarbeitung nach Art. 28 DSGVO – Struktur und Grundsätze.",
  path: "/avv",
  dateModified: "2026-08-02",
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={pageJsonLd} />
      <LegalPageView slug="avv" />
    </>
  );
}
