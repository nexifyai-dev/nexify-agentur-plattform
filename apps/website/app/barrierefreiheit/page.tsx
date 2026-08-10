import { pageMetadata, breadcrumbListJsonLd, webPageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { LegalPageView } from "@/components/legal-page";

export const metadata = pageMetadata({
  title: "Barrierefreiheitserklärung",
  description: "Erklärung zur Barrierefreiheit gemäß BFSG und WCAG 2.1 – ehrlicher Ist-Stand von NeXify AI.",
  path: "/barrierefreiheit",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Barrierefreiheit", path: "/barrierefreiheit" },
]);

const pageJsonLd = webPageJsonLd({
  title: "Barrierefreiheitserklärung",
  description: "Erklärung zur Barrierefreiheit gemäß BFSG und WCAG 2.1 – ehrlicher Ist-Stand von NeXify AI.",
  path: "/barrierefreiheit",
  dateModified: "2026-08-04",
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={pageJsonLd} />
      <LegalPageView slug="barrierefreiheit" />
    </>
  );
}
