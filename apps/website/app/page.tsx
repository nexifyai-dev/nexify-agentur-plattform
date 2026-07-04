import type { Metadata } from "next";
import { HomePage } from "@/components/pages/home";

export const metadata: Metadata = {
  title: "NeXify AI — Premium Websites, Apps & AI-Automatisierung in Tagen",
  description:
    "AI-gestützte Websites, Onlineshops, Web-Apps und Automatisierungen zum transparenten Tagessatz von 999 € netto. Deutsch & Nederlands. Chat it. Automate it.",
};

export default function Page() {
  return <HomePage />;
}
