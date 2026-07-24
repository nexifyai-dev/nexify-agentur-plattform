import type { Metadata } from "next";
import { ReferencesPage } from "@/components/pages/references";

export const metadata: Metadata = {
  title: "Referenzen — Ergebnisse aus Web, Commerce & Automatisierung",
  description: "Anonymisierte Projektergebnisse: Websites in 3 Tagen, Commerce-Plattformen mit 60.000+ Artikeln, 70 % weniger manuelle Bearbeitungszeit durch AI-Automatisierung.",
};

export default function Page() {
  return <ReferencesPage />;
}
