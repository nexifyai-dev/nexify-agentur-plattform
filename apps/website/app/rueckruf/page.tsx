import type { Metadata } from "next";
import { CallbackPage } from "@/components/pages/callback";

export const metadata: Metadata = {
  title: "Rückruf-Termin buchen — Pascal Courbois ruft Sie persönlich an",
  description:
    "Wählen Sie ein freies Zeitfenster und buchen Sie Ihren verbindlichen, kostenlosen Rückruf-Termin. Persönliche Beratung zu Websites, Shops, Apps und AI-Automatisierung – Deutsch & Nederlands.",
  alternates: { canonical: "/rueckruf" },
};

export default function Page() {
  return <CallbackPage />;
}
