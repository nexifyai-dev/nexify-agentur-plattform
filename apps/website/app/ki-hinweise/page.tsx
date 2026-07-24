import type { Metadata } from "next";
import { LegalPageView } from "@/components/legal-page";

export const metadata: Metadata = { title: "KI-Hinweise / AI-verklaring", description: "Transparenz zu AI-gestützter Arbeit bei NeXifyAI – inklusive des KI-Beraters NOVA, menschlicher Kontrolle und EU AI Act." };
export default function Page() {
  return <LegalPageView slug="ki-hinweise" />;
}
