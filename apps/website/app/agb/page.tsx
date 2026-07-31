import { pageMetadata } from "@/lib/seo";
import { LegalPageView } from "@/components/legal-page";

export const metadata = pageMetadata({
  title: "AGB / Algemene voorwaarden (B2B)",
  description: "Allgemeine Geschäftsbedingungen für Beratungs-, Entwicklungs-, Design-, Automatisierungs- und Betriebsleistungen von NeXifyAI.",
  path: "/agb",
});

export default function Page() {
  return <LegalPageView slug="agb" />;
}
