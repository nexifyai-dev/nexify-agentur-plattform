import type { Metadata } from "next";
import { LegalPageView } from "@/components/legal-page";

export const metadata: Metadata = { title: "Datenschutzerklärung / Privacyverklaring", description: "Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO/AVG – Website, KI-Chat NOVA und B2B-Anfragen." };
export default function Page() {
  return <LegalPageView slug="datenschutz" />;
}
