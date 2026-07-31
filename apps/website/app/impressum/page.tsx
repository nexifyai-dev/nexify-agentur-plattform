import { pageMetadata } from "@/lib/seo";
import { LegalPageView } from "@/components/legal-page";

export const metadata = pageMetadata({
  title: "Impressum / Colofon",
  description: "Anbieterkennzeichnung von NeXifyAI by NeXify – Chat it. Automate it.",
  path: "/impressum",
});

export default function Page() {
  return <LegalPageView slug="impressum" />;
}
