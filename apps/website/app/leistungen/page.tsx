import type { Metadata } from "next";
import { ServicesPage } from "@/components/pages/services";

export const metadata: Metadata = {
  title: "Leistungen — Websites, Shops, Apps & AI-Automatisierung",
  description: "Acht klar definierte Leistungsbausteine: Landingpages, Websites, Onlineshops, Enterprise-Commerce, Web-Apps, Mobile Apps, Automatisierung und AI-Agenten. 999 € netto pro Arbeitstag.",
};

export default function Page() {
  return <ServicesPage />;
}
