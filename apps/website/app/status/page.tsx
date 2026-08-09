import { pageMetadata, breadcrumbListJsonLd, webPageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { LegalPageView } from "@/components/legal-page";

export const metadata = pageMetadata({
  title: "Systemstatus | NeXify AI",
  description: "Aktueller Betriebsstatus der NeXify AI Plattform – echte Messwerte, keine Fake-Uptime.",
  path: "/status",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Systemstatus", path: "/status" },
]);

const pageJsonLd = webPageJsonLd({
  title: "Systemstatus | NeXify AI",
  description: "Aktueller Betriebsstatus der NeXify AI Plattform – echte Messwerte, keine Fake-Uptime.",
  path: "/status",
  dateModified: "2026-08-04",
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={pageJsonLd} />
      <LegalPageView slug="status" />
    </>
  );
}
