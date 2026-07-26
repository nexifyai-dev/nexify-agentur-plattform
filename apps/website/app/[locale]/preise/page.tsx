import type { Metadata } from "next";
import { PricingPage } from "@/components/pages/pricing";

/** Safety net: Emergent SoT page if locale prefix is not stripped. */
export const metadata: Metadata = {
  title: 'Preise — 999 € netto pro Arbeitstag, volle Transparenz',
};

export default function Page() {
  return <PricingPage />;
}
