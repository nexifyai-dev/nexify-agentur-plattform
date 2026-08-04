import { pageMetadata, breadcrumbListJsonLd, webPageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { LegalPageView } from "@/components/legal-page";

export const metadata = pageMetadata({
  title: "SLA / Verfügbarkeitsgarantie",
  description: "Service Level Agreement von NeXify AI – Verfügbarkeits- und Reaktionszusagen mit messbarer Realität.",
  path: "/sla",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "SLA", path: "/sla" },
]);

const pageJsonLd = webPageJsonLd({
  title: "SLA / Verfügbarkeitsgarantie",
  description: "Service Level Agreement von NeXify AI – Verfügbarkeits- und Reaktionszusagen mit messbarer Realität.",
  path: "/sla",
  dateModified: "2026-08-04",
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={pageJsonLd} />
      <LegalPageView slug="sla" />
    </>
  );
}
