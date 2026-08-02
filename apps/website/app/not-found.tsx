import type { Metadata } from "next";
import Link from "next/link";

/** Server 404 — HTTP status from notFound()/unmatched routes; explicit noindex. */
export const metadata: Metadata = {
  title: "Seite nicht gefunden",
  description: "Die angeforderte Seite existiert nicht (mehr).",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center pt-24" data-testid="not-found-page">
      <div className="site-container text-center">
        <div className="text-silver font-[family-name:var(--font-heading)] text-8xl font-semibold">404</div>
        <p className="mt-4 text-lg text-zinc-400">Diese Seite existiert nicht (mehr).</p>
        <Link href="/" className="btn-primary mt-8 inline-flex" data-testid="not-found-home-link">
          Zur Startseite
        </Link>
      </div>
    </main>
  );
}
