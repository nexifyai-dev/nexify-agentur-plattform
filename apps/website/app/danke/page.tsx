import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Danke — Anfrage erhalten | NeXify AI",
  description:
    "Vielen Dank für Ihre Anfrage. Wir melden uns in der Regel innerhalb eines Werktags persönlich.",
  path: "/danke",
  noIndex: true,
});

/** Thank-you / post-conversion landing — no fake metrics; honest next steps. */
export default function DankePage() {
  return (
    <main className="flex min-h-[70vh] items-center pt-24" data-testid="thank-you-page">
      <div className="site-container max-w-2xl text-center">
        <p className="text-silver text-sm uppercase tracking-[0.2em]">NeXify AI</p>
        <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-semibold text-zinc-50">
          Danke — wir haben Ihre Anfrage.
        </h1>
        <p className="mt-4 text-lg text-zinc-400">
          In der Regel antworten wir innerhalb eines Werktags persönlich. Kein Bot-Spam, keine
          Fake-Dringlichkeit.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/rueckruf" className="btn-primary inline-flex" data-testid="thank-you-booking">
            Optional: Rückruf-Slot sichern
          </Link>
          <Link href="/wissen" className="btn-secondary inline-flex" data-testid="thank-you-wissen">
            Wissen lesen
          </Link>
          <Link href="/" className="inline-flex text-sm text-zinc-400 underline-offset-4 hover:underline">
            Zur Startseite
          </Link>
        </div>
      </div>
    </main>
  );
}
