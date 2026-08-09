import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { company } from "@/lib/company";
import { breadcrumbListJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "KI-Agentur für KMU — DACH & NL",
  description:
    "KI-gestützte Websites, Apps und Automatisierung für KMU in DACH und NL. Sitz Venlo — remote-first, persönlich, 449 € netto/Tag. Keine Fake-Büros.",
  path: "/ki-agentur",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "KI-Agentur", path: "/ki-agentur" },
]);

const CITIES = [
  "Köln", "Düsseldorf", "Frankfurt", "München", "Berlin", "Hamburg", "Stuttgart",
  "Hannover", "Nürnberg", "Leipzig", "Amsterdam", "Rotterdam", "Eindhoven", "Venlo",
];

export default function KiAgenturPage() {
  return (
    <>
      <main className="pb-16 pt-28 md:pb-24 md:pt-36" data-testid="ki-agentur-page">
        <div className="site-container max-w-4xl">
          <span className="eyebrow">KI-Agentur · DACH + NL</span>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
            KI-Agentur — ehrlich remote-first
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400">
            NeXify AI unterstützt KMU bei Websites, Shops, Web-Apps und AI-Automatisierung.
            Firmensitz: {company.address}, Venlo (NL). Remote-first für DACH + NL —{" "}
            <strong className="font-medium text-zinc-200">ohne erfundene Filialen</strong>.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-zinc-500">
            Tagessatz {company.dayRate}&nbsp;€ netto · ein Ansprechpartner · GitHub/GitLab-Nachweis.
          </p>
          <section className="mt-14" data-testid="ki-agentur-cities">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-light text-white">
              Regionen, die wir remote betreuen
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Stadtnamen zur Orientierung — kein Anspruch auf ein lokales Büro vor Ort.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {CITIES.map((c) => (
                <li key={c} className="rounded-full border border-white/12 bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-300">
                  {c}
                </li>
              ))}
            </ul>
          </section>
          <div className="mt-14 flex flex-wrap gap-3">
            <Link href="/rueckruf?utm_source=ki-agentur&utm_medium=organic&utm_campaign=ki-agentur_rueckruf" className="btn-primary !px-6 !py-3 !text-[13px]" data-testid="ki-agentur-cta">
              Termin buchen <ArrowRight className="size-4" />
            </Link>
            <Link href="/leistungen" className="btn-ghost !px-6 !py-3 !text-[13px]">Leistungen</Link>
            <Link href="/vergleich" className="btn-ghost !px-6 !py-3 !text-[13px]">Vergleich</Link>
          </div>
        </div>
      </main>
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
