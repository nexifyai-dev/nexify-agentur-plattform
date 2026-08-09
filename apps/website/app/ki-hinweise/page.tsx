import { pageMetadata, breadcrumbListJsonLd, webPageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { LegalPageView } from "@/components/legal-page";

export const metadata = pageMetadata({
  title: "KI-Hinweise / AI-verklaring | NeXify AI",
  description: "Transparenz zu KI-Einsatz und Art. 50 AI Act / Art. 22 DSGVO.",
  path: "/ki-hinweise",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "KI-Hinweise", path: "/ki-hinweise" },
]);

const pageJsonLd = webPageJsonLd({
  title: "KI-Hinweise | NeXify AI",
  description: "Transparenz zu KI-Einsatz und Art. 50 AI Act / Art. 22 DSGVO.",
  path: "/ki-hinweise",
  dateModified: "2026-08-02",
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={pageJsonLd} />
      <LegalPageView slug="ki-hinweise" />
    </>
  );
}
