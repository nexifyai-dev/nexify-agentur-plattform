import { pageMetadata, breadcrumbListJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { FaqPage } from "@/components/pages/faq";
import { de } from "@/lib/content/de";
import { flattenFaqItems } from "@/lib/content/faq-categories";

export const metadata = pageMetadata({
  title: "FAQ — Häufige Fragen zu NeXify AI, Preisen, KI & DSGVO | NeXify AI",
  description:
    "FAQ für DACH-KMU: Was ist NeXify AI? Tagessatz 449 € netto, Leistungen, KI-Agenten, Datenschutz/DSGVO, Onboarding und Venlo-Sitz.",
  path: "/faq",
  ogTitle: "FAQ — Preise, KI, DSGVO & Arbeitsweise | NeXify AI",
  ogDescription:
    "50+ Antworten zu Leistungen, Tagessatz 449 €, Automatisierung, Datenschutz und Zusammenarbeit mit NeXify AI.",
});

const faqItems = flattenFaqItems(de.faqCategories);

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "FAQ", path: "/faq" },
]);

export default function Page() {
  return (
    <>
      <FaqPage />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
