import type { Metadata } from "next";
import { FaqPage } from "@/components/pages/faq";

export const metadata: Metadata = {
  title: "FAQ — Häufige Fragen zu Arbeitsweise, Preisen & AI",
  description: "Antworten auf die wichtigsten Fragen: Wie entstehen Websites in 2–3 Tagen? Was kostet ein Arbeitstag? Welche Rolle spielt AI? Was kann der KI-Berater NOVA?",
};

export default function Page() {
  return <FaqPage />;
}
