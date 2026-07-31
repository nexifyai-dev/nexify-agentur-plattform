import { pageMetadata } from "@/lib/seo";
import { FaqPage } from "@/components/pages/faq";
import { de } from "@/lib/content/de";

export const metadata = pageMetadata({
  title: "FAQ — Häufige Fragen zu Arbeitsweise, Preisen & AI",
  description:
    "Antworten auf die wichtigsten Fragen: Wie entstehen Websites in 2–3 Tagen? Was kostet ein Arbeitstag (449 € netto)? Welche Rolle spielt AI? Was kann der KI-Berater NOVA?",
  path: "/faq",
  ogTitle: "FAQ — Preise, Prozess & AI | NeXify AI",
  ogDescription: "Häufige Fragen zu Tagessatz 449 €, Arbeitsweise und AI-Unterstützung bei NeXify AI.",
});

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: de.faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Page() {
  return (
    <>
      <FaqPage />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
