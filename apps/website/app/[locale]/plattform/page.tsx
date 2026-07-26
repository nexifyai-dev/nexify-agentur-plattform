import type { Metadata } from "next";
import { PlatformPage } from "@/components/pages/platform";

/** Safety net: Emergent SoT page if locale prefix is not stripped. */
export const metadata: Metadata = {
  title: 'Plattform — Der Technik-Stack hinter der Geschwindigkeit',
};

export default function Page() {
  return <PlatformPage />;
}
