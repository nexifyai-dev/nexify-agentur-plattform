import { pageMetadata } from "@/lib/seo";
import { LegalPageView } from "@/components/legal-page";

export const metadata = pageMetadata({
  title: "Auftragsverarbeitung (AVV) / Verwerkersovereenkomst",
  description: "Grundsätze der Auftragsverarbeitung nach Art. 28 DSGVO: Bestandteile, Unterauftragsverarbeiter und technische Maßnahmen.",
  path: "/avv",
});

export default function Page() {
  return <LegalPageView slug="avv" />;
}
