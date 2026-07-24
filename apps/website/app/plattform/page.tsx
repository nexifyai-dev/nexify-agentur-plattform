import type { Metadata } from "next";
import { PlatformPage } from "@/components/pages/platform";

export const metadata: Metadata = {
  title: "Plattform — Der Technik-Stack hinter der Geschwindigkeit",
  description: "Next.js, React, TypeScript, Supabase, AI-Agenten und sichere EU-Infrastruktur: der kuratierte Technologie-Stack von NeXify AI – inklusive KI-Berater NOVA.",
};

export default function Page() {
  return <PlatformPage />;
}
