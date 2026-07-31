import { pageMetadata } from "@/lib/seo";
import { HomePage } from "@/components/pages/home";

export const metadata = pageMetadata({
  title: "NeXify AI — Premium Websites, Apps & AI-Automatisierung in Tagen",
  description: "AI-gestützte Websites, Onlineshops, Web-Apps und Automatisierungen zum transparenten Tagessatz von 449 € netto. Deutsch & Nederlands. Chat it. Automate it.",
  path: "/",
  ogTitle: "NeXify AI — Premium Websites, Apps & AI-Automatisierung",
  ogDescription: "Premium-Websites, Shops, Apps und AI-Automatisierung. 449 € netto / Arbeitstag. Deutsch & Nederlands.",
});

export default function Page() {
  return <HomePage />;
}
