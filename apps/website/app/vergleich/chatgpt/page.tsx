import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { JsonLd } from "@/components/json-ld";
import { company } from "@/lib/company";
import { breadcrumbListJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "ChatGPT vs NeXify AI — Texttool oder lieferfertiges System?",
  description:
    "ChatGPT hilft bei Texten und Ideen. NeXify AI liefert Websites, Apps und Automatisierung — persönlich, zum Tagessatz 449 € netto.",
  path: "/vergleich/chatgpt",
});

const breadcrumbJsonLd = breadcrumbListJsonLd([
  { name: "Home", path: "/" },
  { name: "Vergleich", path: "/vergleich" },
  { name: "vs ChatGPT", path: "/vergleich/chatgpt" },
]);

const rows = [
  { label: "Ergebnis", chatgpt: "Text, Ideen, Entwürfe", nexify: "Lauffähiges System + Übergabe" },
  { label: "Verantwortung", chatgpt: "Sie selbst / kein SLA", nexify: "Pascal Courbois persönlich" },
  { label: "Recht & Hosting", chatgpt: "nicht enthalten", nexify: "Impressum-Pfade, Deploy, B2B-Fokus" },
  { label: "Preislogik", chatgpt: "Abo des Modellanbieters", nexify: `${company.dayRate} € netto / Arbeitstag` },
  { label: "Nachweis", chatgpt: "Chat-Verlauf", nexify: "GitHub / GitLab, CI, Reviews" },
];

export default function VergleichChatgptPage() {
  return (
    <>
      <main className="pb-16 pt-28 md:pb-24 md:pt-36" data-testid="vergleich-chatgpt-page">
        <div className="site-container max-w-4xl">
          <span className="eyebrow">Vergleich · AI-Begleiter</span>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
            ChatGPT vs. NeXify AI
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400">
            ChatGPT ist stark für Formulierungen. Ein unternehmensreifes Produkt braucht Architektur,
            Integration und jemanden, der liefert — NeXify AI: AI-beschleunigt, menschlich freigegeben.
          </p>
          <div className="mt-12 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]" data-testid="vergleich-chatgpt-table">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                  <th className="px-5 py-4 font-bold">Kriterium</th>
                  <th className="px-5 py-4 font-bold">Nur ChatGPT</th>
                  <th className="px-5 py-4 font-bold text-white">NeXify AI</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-4 font-medium text-zinc-300">{r.label}</td>
                    <td className="px-5 py-4 text-zinc-500">{r.chatgpt}</td>
                    <td className="px-5 py-4 text-zinc-100">{r.nexify}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-10 space-y-2 text-sm text-zinc-300">
            {["AI als Beschleuniger — Haftung bleibt beim Menschen.", "Kein Fake-Marketing ohne Liefernachweis."].map((t) => (
              <li key={t} className="flex items-start gap-2">
                <Check size={14} className="mt-1 shrink-0 text-emerald-400/80" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/rueckruf" className="btn-primary !px-6 !py-3 !text-[13px]" data-testid="vergleich-chatgpt-cta">
              Termin buchen <ArrowRight className="size-4" />
            </Link>
            <Link href="/vergleich" className="btn-ghost !px-6 !py-3 !text-[13px]">Alle Vergleiche</Link>
          </div>
        </div>
      </main>
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
