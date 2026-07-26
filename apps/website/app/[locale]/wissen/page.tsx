import type { Metadata } from "next";
import { KnowledgePage } from "@/components/pages/knowledge";

/** Safety net: Emergent SoT page if locale prefix is not stripped. */
export const metadata: Metadata = {
  title: 'Wissen — Einblicke in AI-gestützte Entwicklung',
};

export default function Page() {
  return <KnowledgePage />;
}
