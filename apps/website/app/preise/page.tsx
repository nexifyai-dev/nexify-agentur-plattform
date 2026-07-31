import { pageMetadata, breadcrumbListJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { PricingPage } from "@/components/pages/pricing";

export const metadata = pageMetadata({
  title: "Preise — 449 € netto pro Arbeitstag, volle Transparenz",
  description: "Ein Tagessatz für alles: 449 € netto pro Arbeitstag. Interaktiver Projektkosten-Rechner, klare Leistungsspannen, keine versteckten Kosten. Ausschließlich B2B.",
  path: "/preise",
  ogTitle: "Preise — 449 € netto / Arbeitstag | NeXify AI",
  ogDescription: "Transparente B2B-Preise: 449 € netto pro Arbeitstag. Keine versteckten Kosten.",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Preise", path: "/preise" },
]);

export default function Page() {
  return (
    <>
      <PricingPage />
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
