"use client";

import { legalDe } from "@/lib/legal/de";
import { legalNl } from "@/lib/legal/nl";
import { useLang } from "@/lib/i18n";

export function LegalPageView({ slug }: { slug: string }) {
  const { lang } = useLang();
  const page = (lang === "nl" ? legalNl : legalDe)[slug];
  if (!page) return null;
  const updatedLabel = lang === "nl" ? "Laatst bijgewerkt" : "Stand";

  return (
    <main className="pb-10 pt-28 md:pt-36" data-testid={`legal-page-${slug}`}>
      <div className="site-container">
        <div className="max-w-3xl">
          <span className="eyebrow">{lang === "nl" ? "Juridisch" : "Rechtliches"}</span>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">{page.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-400">{page.intro}</p>
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-zinc-600">
            {updatedLabel}: {page.updated}
          </p>

          <div className="mt-12 space-y-10">
            {page.sections.map((s, i) => (
              <section key={i}>
                <h2 className="font-[family-name:var(--font-heading)] text-xl font-medium text-white">{s.heading}</h2>
                {s.paragraphs?.map((p, j) => (
                  <p key={j} className="mt-3 text-[15px] leading-[1.85] text-zinc-400">
                    {p}
                  </p>
                ))}
                {s.bullets && (
                  <ul className="mt-3 space-y-2">
                    {s.bullets.map((b, j) => (
                      <li key={j} className="flex gap-3 text-[15px] leading-relaxed text-zinc-400">
                        <span className="mt-[9px] block size-1 shrink-0 rounded-full bg-zinc-500" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
