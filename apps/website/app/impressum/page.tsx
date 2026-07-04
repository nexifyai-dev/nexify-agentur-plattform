import type { Metadata } from "next";
import { LegalPageView } from "@/components/legal-page";

export const metadata: Metadata = { title: "Impressum / Colofon", description: "Anbieterkennzeichnung von NeXifyAI by NeXify – Chat it. Automate it." };
export default function Page() {
  return <LegalPageView slug="impressum" />;
}
