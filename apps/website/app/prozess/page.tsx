import type { Metadata } from "next";
import { ProcessPage } from "@/components/pages/process";

export const metadata: Metadata = {
  title: "Prozess — Fünf Schritte von der Idee zum Betrieb",
  description: "Standardisierter Ablauf: Zielklärung, Festpreisrahmen, AI-gestützte Umsetzung, Tests und Übergabe. Projekte in Tagen statt Monaten – ohne Überraschungen.",
};

export default function Page() {
  return <ProcessPage />;
}
