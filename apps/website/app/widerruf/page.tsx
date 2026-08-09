import { pageMetadata, breadcrumbListJsonLd, webPageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { LegalPageView } from "@/components/legal-page";

export const metadata = pageMetadata({
  title: "Widerruf / Herroeping | NeXify AI",
  description: "Hinweis: kein Verbraucher-Widerrufsrecht bei ausschließlich B2B-Verträgen.",
  path: "/widerruf",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Widerruf", path: "/widerruf" },
]);

const pageJsonLd = webPageJsonLd({
  title: "Widerruf | NeXify AI",
  description: "Hinweis: kein Verbraucher-Widerrufsrecht bei ausschließlich B2B-Verträgen.",
  path: "/widerruf",
  dateModified: "2026-08-02",
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={pageJsonLd} />
      <LegalPageView slug="widerruf" />
    </>
  );
}
