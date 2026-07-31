import { pageMetadata } from "@/lib/seo";
import { HomePage } from "@/components/pages/home";

/** Safety net: if a request reaches /[locale] without middleware strip, still serve Emergent HomePage. */
export const metadata = pageMetadata({
  title: "NeXify AI — Premium Websites, Apps & AI-Automatisierung in Tagen",
  description: "AI-gestützte Websites, Onlineshops, Web-Apps und Automatisierungen zum transparenten Tagessatz von 449 € netto. Deutsch & Nederlands. Chat it. Automate it.",
  path: "/",
});

export default function Page() {
  return <HomePage />;
}
