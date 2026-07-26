import type { Metadata } from "next";
import { ReferencesPage } from "@/components/pages/references";

/** Safety net: Emergent SoT page if locale prefix is not stripped. */
export const metadata: Metadata = {
  title: 'Referenzen — Ergebnisse aus Web, Commerce & Automatisierung',
};

export default function Page() {
  return <ReferencesPage />;
}
