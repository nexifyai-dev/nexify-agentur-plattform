import { pageMetadata, breadcrumbListJsonLd, webPageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { LegalPageView } from "@/components/legal-page";

export const metadata = pageMetadata({
  title: "Security & Vertrauen | NeXify AI",
  description: "Sicherheitsmaßnahmen, Responsible Disclosure und security.txt-Alignment von NeXify AI.",
  path: "/security",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Security", path: "/security" },
]);

const pageJsonLd = webPageJsonLd({
  title: "Security & Vertrauen | NeXify AI",
  description: "Sicherheitsmaßnahmen, Responsible Disclosure und security.txt-Alignment von NeXify AI.",
  path: "/security",
  dateModified: "2026-08-04",
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={pageJsonLd} />
      <LegalPageView slug="security" />
    </>
  );
}
