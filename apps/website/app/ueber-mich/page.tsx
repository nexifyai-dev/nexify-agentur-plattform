import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/about";

export const metadata: Metadata = {
  title: "Über mich — Pascal Courbois, der Fachmann hinter NeXify AI",
  description: "Ein Ansprechpartner für Strategie, Design, Entwicklung und Betrieb. Aus Venlo für DE, AT, CH und NL – persönlich, verbindlich, AI-beschleunigt.",
};

export default function Page() {
  return <AboutPage />;
}
