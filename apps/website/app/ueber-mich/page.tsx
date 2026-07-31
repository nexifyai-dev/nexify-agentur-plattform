import { pageMetadata } from "@/lib/seo";
import { AboutPage } from "@/components/pages/about";

export const metadata = pageMetadata({
  title: "Über mich — Pascal Courbois, der Fachmann hinter NeXify AI",
  description: "Deutscher aus der Grenzregion Limburg, seit 5+ Jahren in den Niederlanden. 20+ Jahre Erfahrung in IT, Programmierung, Kaufmannswesen und Vertrieb. Persönlich, verbindlich, AI-beschleunigt – für DE, AT, CH und NL.",
  path: "/ueber-mich",
  ogTitle: "Über Pascal Courbois | NeXify AI",
  ogDescription: "Persönliche Verantwortung statt Agentur-Overhead. IT, Vertrieb und AI-gestützte Umsetzung für DACH + NL.",
});

export default function Page() {
  return <AboutPage />;
}
