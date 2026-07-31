import { pageMetadata, breadcrumbListJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { AboutPage } from "@/components/pages/about";

export const metadata = pageMetadata({
  title: "Über mich — Pascal Courbois, der Fachmann hinter NeXify AI",
  description: "Deutscher aus der Grenzregion Limburg, seit 5+ Jahren in den Niederlanden. 20+ Jahre Erfahrung in IT, Programmierung, Kaufmannswesen und Vertrieb. Persönlich, verbindlich, AI-beschleunigt – für DE, AT, CH und NL.",
  path: "/ueber-mich",
  ogTitle: "Über Pascal Courbois | NeXify AI",
  ogDescription: "Persönliche Verantwortung statt Agentur-Overhead. IT, Vertrieb und AI-gestützte Umsetzung für DACH + NL.",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Über mich", path: "/ueber-mich" },
]);

export default function Page() {
  return (
    <>
      <AboutPage />
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
