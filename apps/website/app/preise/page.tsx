import { pageMetadata, breadcrumbListJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { PricingPage } from "@/components/pages/pricing";

export const metadata = pageMetadata({
  title: "Preise — 449 € netto statt 1.000–1.500 € IT-Tagessatz",
  description: "Fester Tagessatz 449 € netto: AI-Begleiter senkt Overhead gegenüber typischen 1.000–1.500 €. Projektkosten-Rechner, Revolut-Anzahlung, Belege im Kundenportal. B2B.",
  path: "/preise",
  ogTitle: "Preise — 449 € netto / Arbeitstag | NeXify AI",
  ogDescription: "449 € statt typisch 1.000–1.500 €. Transparent, B2B, Revolut-Belege im Portal.",
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
