import type { Metadata } from "next";
import Link from "next/link";

/** Server 404 — HTTP status from notFound()/unmatched routes; explicit noindex. */
export const metadata: Metadata = {
  title: "Seite nicht gefunden",
  description: "Die angeforderte Seite existiert nicht (mehr).",
  robots: { index: false, follow: false },
};

/**
 * Server 404 — no client lang hook (avoids hydration/fallback quirks on soft-404 paths).
 */
export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center pt-24" data-testid="not-found-page">
      <div className="site-container text-center">
        <div className="text-silver font-[family-name:var(--font-heading)] text-8xl font-semibold">404</div>
        <p className="mt-4 text-lg text-zinc-400">Diese Seite existiert nicht (meer) / Deze pagina bestaat niet.</p>
        <p className="mt-2 text-sm text-zinc-500">Zurück zur Startseite — oder Termin unter /rueckruf.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn-primary inline-flex" data-testid="not-found-home-link">
            Zur Startseite
          </Link>
          <Link href="/rueckruf?utm_source=not-found&utm_medium=organic&utm_campaign=not-found_rueckruf" className="btn-secondary inline-flex" data-testid="not-found-booking-link">
            Rückruf buchen
          </Link>
          <Link href="/faq" className="inline-flex text-sm text-zinc-400 underline-offset-4 hover:underline" data-testid="not-found-faq-link">
            FAQ
          </Link>
        </div>
      </div>
    </main>
  );
}
