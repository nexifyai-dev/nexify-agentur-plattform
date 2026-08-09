import { pageMetadata, breadcrumbListJsonLd, webPageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { LegalPageView } from "@/components/legal-page";

export const metadata = pageMetadata({
  title: "Cookie-Richtlinie / Cookiebeleid | NeXify AI",
  description: "Cookies und Speichertechniken gemäß § 25 TDDDG – Kategorien Notwendig, Statistik, Marketing.",
  path: "/cookie-richtlinie",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Cookie-Richtlinie", path: "/cookie-richtlinie" },
]);

const pageJsonLd = webPageJsonLd({
  title: "Cookie-Richtlinie | NeXify AI",
  description: "Cookies und Speichertechniken gemäß § 25 TDDDG – Kategorien Notwendig, Statistik, Marketing.",
  path: "/cookie-richtlinie",
  dateModified: "2026-08-02",
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={pageJsonLd} />
      <LegalPageView slug="cookie-richtlinie" />
    </>
  );
}
