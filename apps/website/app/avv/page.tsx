import type { Metadata } from "next";
import { LegalPageView } from "@/components/legal-page";

export const metadata: Metadata = { title: "Auftragsverarbeitung (AVV) / Verwerkersovereenkomst", description: "Grundsätze der Auftragsverarbeitung nach Art. 28 DSGVO: Bestandteile, Unterauftragsverarbeiter und technische Maßnahmen." };
export default function Page() {
  return <LegalPageView slug="avv" />;
}
