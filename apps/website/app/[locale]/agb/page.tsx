import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { legalPages } from "@/lib/legal-content";
import { legalPagesNl } from "@/lib/legal/nl";
import { legalPagesEn } from "@/lib/legal/en";

const allLegal: Record<string, typeof legalPages> = { de: legalPages, nl: legalPagesNl, en: legalPagesEn };
const slug = "agb";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const pages = allLegal[locale] ?? allLegal.de;
  return { title: pages[slug].title, description: pages[slug].intro };
}

export default async function LegalPageDynamic({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const pages = allLegal[locale] ?? allLegal.de;
  const lang = locale === "nl" || locale === "en" ? locale : "de";
  return <LegalPage page={pages[slug]} lang={lang} />;
}
