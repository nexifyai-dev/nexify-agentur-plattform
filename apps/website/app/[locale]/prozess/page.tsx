import type { Metadata } from "next";
import { ProcessPage } from "@/components/pages/process";

/** Safety net: Emergent SoT page if locale prefix is not stripped. */
export const metadata: Metadata = {
  title: 'Prozess — Fünf Schritte von der Idee zum Betrieb',
};

export default function Page() {
  return <ProcessPage />;
}
