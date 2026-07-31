import { pageMetadata } from "@/lib/seo";
import { LegalPageView } from "@/components/legal-page";

export const metadata = pageMetadata({
  title: "Datenschutzerklärung / Privacyverklaring",
  description: "Informationen zur Verarbeitung personenbezogener Daten gemäß DSGVO/AVG – Website, KI-Chat NOVA und B2B-Anfragen.",
  path: "/datenschutz",
});

export default function Page() {
  return <LegalPageView slug="datenschutz" />;
}
