import type { Metadata } from "next";
import { LegalPageView } from "@/components/legal-page";

export const metadata: Metadata = { title: "Widerruf / Herroeping", description: "Hinweis zum Widerrufsrecht: NeXifyAI bietet Leistungen ausschließlich im unternehmerischen Geschäftsverkehr (B2B) an." };
export default function Page() {
  return <LegalPageView slug="widerruf" />;
}
