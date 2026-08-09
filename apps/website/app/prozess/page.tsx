import { pageMetadata, breadcrumbListJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { ProcessPage } from "@/components/pages/process";

export const metadata = pageMetadata({
  title: "Prozess — Sechs Schritte von der Idee zum Betrieb",
  description: "Standardisierter Ablauf: Zielklärung, Festpreisrahmen, AI-gestützte Umsetzung, Tests und Übergabe. Projekte in Tagen statt Monaten – ohne Überraschungen.",
  path: "/prozess",
  ogTitle: "Prozess — Von der Idee zum Betrieb in Tagen | NeXify AI",
  ogDescription: "Sechs klare Schritte: Zielklärung, Konzept, Umsetzung, Tests, Übergabe, Betrieb. AI-gestützt, persönlich verantwortet.",
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
