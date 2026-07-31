import { pageMetadata } from "@/lib/seo";
import { LegalPageView } from "@/components/legal-page";

export const metadata = pageMetadata({
  title: "Cookie-Richtlinie / Cookiebeleid",
  description: "Cookie- und Speicherhinweise: datensparsame Nutzung ohne standardmäßiges Marketing-Tracking.",
  path: "/cookie-richtlinie",
});

export default function Page() {
  return <LegalPageView slug="cookie-richtlinie" />;
}
