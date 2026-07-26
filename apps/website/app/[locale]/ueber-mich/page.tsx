import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/about";

/** Safety net: Emergent SoT page if locale prefix is not stripped. */
export const metadata: Metadata = {
  title: 'Über mich — Pascal Courbois, der Fachmann hinter NeXify AI',
};

export default function Page() {
  return <AboutPage />;
}
