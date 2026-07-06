import type { Metadata } from "next";
import { PricingPage } from "@/components/pages/pricing";

export const metadata: Metadata = {
  title: "Preise — 999 € netto pro Arbeitstag, volle Transparenz",
  description: "Ein Tagessatz für alles: 999 € netto pro Arbeitstag. Interaktiver Projektkosten-Rechner, klare Leistungsspannen, keine versteckten Kosten. Ausschließlich B2B.",
};

export default function Page() {
  return <PricingPage />;
}
