import { pageMetadata } from "@/lib/seo";
import { HomePage } from "@/components/pages/home";

/** Only reached for valid locales (dynamicParams=false). Invalid segments → 404 via layout. */
export const metadata = pageMetadata({
  title: "NeXify AI — KI-Agenten für Ihr Unternehmen · Auf Autopilot.",
  description:
    "NeXify AI plant, baut und betreibt KI-Agenten, die Anfragen beantworten, Termine buchen und Prozesse automatisieren. 449 €/Umsetzungstag. Deutsch & Nederlands. Chat it. Automate it.",
  path: "/",
});

export default function Page() {
  return <HomePage />;
}
