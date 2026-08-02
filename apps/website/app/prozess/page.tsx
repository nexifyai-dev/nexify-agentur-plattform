import { pageMetadata, breadcrumbListJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { ProcessPage } from "@/components/pages/process";

export const metadata = pageMetadata({
  title: "Prozess — Transparenz, QA & Kundenportal von Anfrage bis Rechnung",
  description: "Arbeitsweise mit AI-Begleiter: Scope-Klarheit, GitHub/GitLab-Delivery, Qualitätssicherung und Status-Transparenz im Kundenportal — in Tagen statt Monaten.",
  path: "/prozess",
  ogTitle: "Prozess — Transparenz von Idee bis Rechnung | NeXify AI",
  ogDescription: "Fünf Schritte plus Portal-Status, Evidence und QA. AI-gestützt, persönlich verantwortet.",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Prozess", path: "/prozess" },
]);

export default function Page() {
  return (
    <>
      <ProcessPage />
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
