import { pageMetadata } from "@/lib/seo";
import { LegalPageView } from "@/components/legal-page";

export const metadata = pageMetadata({
  title: "Widerruf / Herroeping",
  description: "Hinweis zum Widerrufsrecht: NeXifyAI bietet Leistungen ausschließlich im unternehmerischen Geschäftsverkehr (B2B) an.",
  path: "/widerruf",
});

export default function Page() {
  return <LegalPageView slug="widerruf" />;
}
