import { pageMetadata } from "@/lib/seo";
import { HomePage } from "@/components/pages/home";

/** Only reached for valid locales (dynamicParams=false). Invalid segments → 404 via layout. */
export const metadata = pageMetadata({
  title: "NeXify AI — Premium Websites, Apps & AI-Automatisierung in Tagen",
  description: "AI-gestützte Websites, Onlineshops, Web-Apps und Automatisierungen zum transparenten Tagessatz von 449 € netto. Deutsch & Nederlands. AUTOMATE IT.",
  path: "/",
});

export default function Page() {
  return <HomePage />;
}
