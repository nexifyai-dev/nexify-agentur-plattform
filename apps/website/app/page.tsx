import { pageMetadata } from "@/lib/seo";
import { HomePage } from "@/components/pages/home";

export const metadata = pageMetadata({
  title: "NeXify AI — AI-Begleiter · 449 € statt 1.000–1.500 € · Websites & Software",
  description: "AI als Begleiter: Premium-Websites, Shops, Apps und Automatisierung zum Tagessatz 449 € netto statt typisch 1.000–1.500 €. GitHub/GitLab-Qualität, Kundenportal mit Status & Rechnungen. DACH.",
  path: "/",
  ogTitle: "NeXify AI — AI-Begleiter · 449 € Tagessatz",
  ogDescription: "Qualität in Rekordzeit. 449 € netto / Arbeitstag statt typisch 1.000–1.500 €. Deutsch & Nederlands.",
});

export default function Page() {
  return <HomePage />;
}
