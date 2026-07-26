import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/contact";

/** Safety net: Emergent SoT page if locale prefix is not stripped. */
export const metadata: Metadata = {
  title: 'Kontakt — Anfrage senden, Antwort in 24 Stunden',
};

export default function Page() {
  return <ContactPage />;
}
