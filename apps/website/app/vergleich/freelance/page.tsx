import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { company } from "@/lib/company";
import { breadcrumbListJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Freelance vs NeXify AI — wann welcher Weg?",
  description:
    "Freelance ist flexibel. NeXify AI bundelt Web, Shop und AI-Automatisierung mit festem Tagessatz — auch als White-Label-Partner.",
  path: "/vergleich/freelance",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Vergleich", path: "/vergleich" },
  { name: "vs Freelance", path: "/vergleich/freelance" },
]);

const rows = [
  { label: "Kapazität", freelance: "oft 1 Person, Engpass", nexify: "planbarer Tagessatz" },
  { label: "Scope", freelance: "personenabhängig", nexify: "klare Bausteine + ehrliche Spanne" },
  { label: "Nachweis", freelance: "variabel", nexify: "GitHub/GitLab, CI" },
  { label: "Preis", freelance: "sehr breit", nexify: `${company.dayRate} € netto / Tag` },
  { label: "Partner", freelance: "Konkurrenz möglich", nexify: "White-Label / Overflow willkommen" },
];

export default function VergleichFreelancePage() {
  return (
    <>
      <main className="pb-16 pt-28 md:pb-24 md:pt-36" data-testid="vergleich-freelance-page">
        <div className="site-container max-w-4xl">
          <span className="eyebrow">Vergleich · Delivery</span>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
            Freelance vs. NeXify AI
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Viele Freelancer liefern exzellente Arbeit. Für festen Ansprechpartner inkl. Web/Shop/AI
            oder Overflow als Partner — melden Sie sich.
          </p>
          <div className="mt-12 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]" data-testid="vergleich-freelance-table">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                  <th className="px-5 py-4 font-bold">Kriterium</th>
                  <th className="px-5 py-4 font-bold">Typischer Freelance</th>
                  <th className="px-5 py-4 font-bold text-white">NeXify AI</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-4 font-medium text-zinc-300">{r.label}</td>
                    <td className="px-5 py-4 text-zinc-500">{r.freelance}</td>
                    <td className="px-5 py-4 text-zinc-100">{r.nexify}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/rueckruf" className="btn-primary !px-6 !py-3 !text-[13px]" data-testid="vergleich-freelance-cta">
              Termin buchen <ArrowRight className="size-4" />
            </Link>
            <Link href="/partner" className="btn-ghost !px-6 !py-3 !text-[13px]">Partner werden</Link>
          </div>
        </div>
      </main>
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
