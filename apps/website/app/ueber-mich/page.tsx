import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/about";

export const metadata: Metadata = {
  title: "Über mich — Pascal Courbois, der Fachmann hinter NeXify AI",
  description: "Deutscher aus der Grenzregion Limburg, seit 5+ Jahren in den Niederlanden. 20+ Jahre Erfahrung in IT, Programmierung, Kaufmannswesen und Vertrieb (Telekom, Vodafone, Postcon). Persönlich, verbindlich, AI-beschleunigt – für DE, AT, CH und NL.",
};

export default function Page() {
  return <AboutPage />;
}
