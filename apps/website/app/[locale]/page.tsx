import type { Metadata } from "next";
import { HomePage } from "@/components/pages/home";

/**
 * Safety net: if a request reaches /[locale] without middleware strip,
 * still serve the Emergent HomePage (PR47 SoT) — not the legacy i18n tree.
 */
export const metadata: Metadata = {
  title: "NeXify AI — Premium Websites, Apps & AI-Automatisierung in Tagen",
  description:
    "AI-gestützte Websites, Onlineshops, Web-Apps und Automatisierungen zum transparenten Tagessatz von 999 € netto. Deutsch & Nederlands. Chat it. Automate it.",
};

export default function LocaleHomePage() {
  return <HomePage />;
}
