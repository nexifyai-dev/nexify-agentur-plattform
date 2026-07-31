import { pageMetadata } from "@/lib/seo";
import { ReferencesPage } from "@/components/pages/references";

export const metadata = pageMetadata({
  title: "Referenzen — Ergebnisse aus Web, Commerce & Automatisierung",
  description: "Anonymisierte Projektergebnisse: Websites in 3 Tagen, Commerce-Plattformen mit 60.000+ Artikeln, 70 % weniger manuelle Bearbeitungszeit durch AI-Automatisierung.",
  path: "/referenzen",
  ogTitle: "Referenzen — Web, Commerce & AI-Automatisierung | NeXify AI",
  ogDescription: "Projektergebnisse: Websites in Tagen, Commerce mit 60.000+ Artikeln, spürbare Automation-Effekte.",
});

export default function Page() {
  return <ReferencesPage />;
}
