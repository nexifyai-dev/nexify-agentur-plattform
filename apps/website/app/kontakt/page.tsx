import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/contact";

export const metadata: Metadata = {
  title: "Kontakt — Anfrage senden, Antwort in 24 Stunden",
  description: "Beschreiben Sie Ihr Projekt und erhalten Sie innerhalb eines Werktags eine ehrliche Einschätzung mit Aufwandsspanne. Oder chatten Sie sofort mit dem NeXify AI Berater.",
};

export default function Page() {
  return <ContactPage />;
}
