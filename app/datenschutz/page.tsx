import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { legalPages } from "@/lib/legal-content";

const page = legalPages["datenschutz"];
export const metadata: Metadata = { title: page.title, description: page.intro, robots: { index: true, follow: true } };
export default function Page() { return <LegalPage page={page} />; }
