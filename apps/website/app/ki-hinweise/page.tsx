import { pageMetadata } from "@/lib/seo";
import { LegalPageView } from "@/components/legal-page";

export const metadata = pageMetadata({
  title: "KI-Hinweise / AI-verklaring",
  description: "Transparenz zu AI-gestützter Arbeit bei NeXifyAI – inklusive des KI-Beraters NOVA, menschlicher Kontrolle und EU AI Act.",
  path: "/ki-hinweise",
});

export default function Page() {
  return <LegalPageView slug="ki-hinweise" />;
}
