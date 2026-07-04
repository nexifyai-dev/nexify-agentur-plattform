import type { Metadata } from "next";
import { LegalPageView } from "@/components/legal-page";

export const metadata: Metadata = { title: "Cookie-Richtlinie / Cookiebeleid", description: "Cookie- und Speicherhinweise: datensparsame Nutzung ohne standardmäßiges Marketing-Tracking." };
export default function Page() {
  return <LegalPageView slug="cookie-richtlinie" />;
}
