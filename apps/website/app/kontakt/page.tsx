import { pageMetadata, breadcrumbListJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { ContactPage } from "@/components/pages/contact";

export const metadata = pageMetadata({
  title: "Kontakt — Anfrage senden, Antwort in 24 Stunden | NeXify AI",
  description: "Beschreiben Sie Ihr Projekt und erhalten Sie innerhalb eines Werktags eine ehrliche Einschätzung mit Aufwandsspanne. Oder chatten Sie sofort mit dem NeXify AI Berater.",
  path: "/kontakt",
  ogTitle: "Kontakt — Projekt anfragen | NeXify AI",
  ogDescription: "Projekt beschreiben, Einschätzung innerhalb eines Werktags. B2B, Deutsch & Nederlands.",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Kontakt", path: "/kontakt" },
]);

export default function Page() {
  return (
    <>
      <ContactPage />
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
