import type { Metadata } from "next";
import { LegalPageView } from "@/components/legal-page";

export const metadata: Metadata = { title: "AGB / Algemene voorwaarden (B2B)", description: "Allgemeine Geschäftsbedingungen für Beratungs-, Entwicklungs-, Design-, Automatisierungs- und Betriebsleistungen von NeXifyAI." };
export default function Page() {
  return <LegalPageView slug="agb" />;
}
