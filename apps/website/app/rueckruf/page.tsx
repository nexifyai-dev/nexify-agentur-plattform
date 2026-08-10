import { pageMetadata, breadcrumbListJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { CallbackPage } from "@/components/pages/callback";

export const metadata = pageMetadata({
  title: "Rückruf-Termin buchen — Pascal Courbois ruft Sie persönlich an",
  description: "Wählen Sie ein freies Zeitfenster und buchen Sie Ihren verbindlichen, kostenlosen Rückruf-Termin. Persönliche Beratung zu Websites, Shops, Apps und AI-Automatisierung – Deutsch & Nederlands.",
  path: "/rueckruf",
  ogTitle: "Rückruf-Termin buchen | NeXify AI",
  ogDescription: "Kostenlosen Rückruf mit Pascal Courbois buchen — persönliche Beratung zu Web, Shop und AI.",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Rückruf", path: "/rueckruf" },
]);

export default function Page() {
  return (
    <>
      <CallbackPage />
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
