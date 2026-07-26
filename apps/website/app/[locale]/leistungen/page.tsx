import type { Metadata } from "next";
import { ServicesPage } from "@/components/pages/services";

/** Safety net: Emergent SoT page if locale prefix is not stripped. */
export const metadata: Metadata = {
  title: 'Leistungen — Websites, Shops, Apps & AI-Automatisierung',
};

export default function Page() {
  return <ServicesPage />;
}
