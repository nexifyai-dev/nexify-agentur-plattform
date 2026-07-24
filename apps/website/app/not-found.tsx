"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang-context";

export default function NotFound() {
  const { lang } = useLang();
  return (
    <main className="flex min-h-[70vh] items-center pt-24" data-testid="not-found-page">
      <div className="site-container text-center">
        <div className="text-silver font-[family-name:var(--font-heading)] text-8xl font-semibold">404</div>
        <p className="mt-4 text-lg text-zinc-400">{lang === "nl" ? "Deze pagina bestaat niet (meer)." : "Diese Seite existiert nicht (mehr)."}</p>
        <Link href="/" className="btn-primary mt-8 inline-flex" data-testid="not-found-home-link">
          {lang === "nl" ? "Naar de startpagina" : "Zur Startseite"}
        </Link>
      </div>
    </main>
  );
}
