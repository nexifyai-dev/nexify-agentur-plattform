import { pageMetadata } from "@/lib/seo";
import { PricingPage } from "@/components/pages/pricing";

/** Safety net: Emergent SoT page if locale prefix is not stripped. */
export const metadata = pageMetadata({
  title: "Preise — 449 € netto pro Arbeitstag, volle Transparenz",
  description: "Ein Tagessatz für alles: 449 € netto pro Arbeitstag. Interaktiver Projektkosten-Rechner, klare Leistungsspannen, keine versteckten Kosten. Ausschließlich B2B.",
  path: "/preise",
});

export default function Page() {
  return <PricingPage />;
}
