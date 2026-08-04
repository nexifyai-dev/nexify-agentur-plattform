"use client";

import Link from "next/link";
import { legalDe } from "@/lib/legal/de";
import { legalNl } from "@/lib/legal/nl";
import { useLang } from "@/lib/lang-context";
import type { LegalPageData, LegalSection } from "@/lib/legal/de";

/** Returns true for editorial placeholder strings that must be filled by the owner before publishing. */
function isPlaceholder(text: string): boolean {
  return text.startsWith("[BITTE ERGÄNZEN:");
}

/** Renders a single text item — placeholders get a distinct amber warning style. */
function TextItem({ text, className }: { text: string; className: string }) {
  if (isPlaceholder(text)) {
    return (
      <span className="inline-block rounded border border-amber-500/40 bg-amber-950/30 px-2 py-0.5 font-mono text-[13px] text-amber-400" aria-label="Platzhalter – bitte ergänzen">
        {text}
      </span>
    );
  }
  return <span className={className}>{text}</span>;
}

const EYEBROW = { de: "Rechtliches", nl: "Juridisch", en: "Legal" };
const UPDATED_LABEL = { de: "Stand", nl: "Laatst bijgewerkt", en: "Last updated" };
const TOC_LABEL = { de: "Inhalt", nl: "Inhoud", en: "Contents" };
const RELATED_LABEL = { de: "Weitere Rechtstexte", nl: "Overige juridische teksten", en: "Related legal pages" };
const DISCLAIMER = {
  de: "Kein Rechtsrat — Stand {date} — Prüfung durch Fachanwalt empfohlen.",
  nl: "Geen juridisch advies — Stand {date} — toetsing door een advocaat wordt aanbevolen.",
  en: "Not legal advice — as of {date} — review by a qualified attorney is recommended.",
};

function sectionId(s: LegalSection, index: number): string {
  return s.id ?? `section-${index + 1}`;
}

function SectionBlock({ s, index }: { s: LegalSection; index: number }) {
  const id = sectionId(s, index);
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="font-[family-name:var(--font-heading)] text-xl font-medium text-white">{s.heading}</h2>
      {s.paragraphs?.map((p, j) => (
        <p key={j} className="mt-3 text-[15px] leading-[1.85] text-zinc-400">
          <TextItem text={p} className="text-zinc-400" />
        </p>
      ))}
      {s.bullets && (
        <ul className="mt-3 space-y-2">
          {s.bullets.map((b, j) => (
            <li key={j} className="flex gap-3 text-[15px] leading-relaxed text-zinc-400">
              <span className="mt-[9px] block size-1 shrink-0 rounded-full bg-zinc-500" />
              <TextItem text={b} className="text-zinc-400" />
            </li>
          ))}
        </ul>
      )}
      {s.subsections?.map((sub, k) => (
        <div key={k} id={sub.id ?? `${id}-${k + 1}`} className="mt-6 scroll-mt-28">
          <h3 className="font-[family-name:var(--font-heading)] text-base font-medium text-zinc-200">{sub.heading}</h3>
          {sub.paragraphs?.map((p, j) => (
            <p key={j} className="mt-2 text-[15px] leading-[1.85] text-zinc-400">
              <TextItem text={p} className="text-zinc-400" />
            </p>
          ))}
          {sub.bullets && (
            <ul className="mt-2 space-y-2">
              {sub.bullets.map((b, j) => (
                <li key={j} className="flex gap-3 text-[15px] leading-relaxed text-zinc-400">
                  <span className="mt-[9px] block size-1 shrink-0 rounded-full bg-zinc-500" />
                  <TextItem text={b} className="text-zinc-400" />
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
}

/** Locale-prefixed app/[locale]/* route tree — page data already resolved server-side. */
export function LegalPage({ page, lang = "de" }: { page: LegalPageData; lang?: "de" | "nl" | "en" }) {
  const showToc = page.sections.length >= 6;
  const disclaimer = DISCLAIMER[lang].replace("{date}", page.updated);

  return (
    <main className="pb-10 pt-28 md:pt-36" data-testid={`legal-page-${page.slug}`}>
      <div className="site-container">
        <div className="max-w-3xl">
          <span className="eyebrow">{EYEBROW[lang]}</span>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">{page.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-400">{page.intro}</p>
          <p className="mt-3 text-xs uppercase tracking-[0.2em] text-zinc-600" data-testid="legal-updated">
            {UPDATED_LABEL[lang]}: {page.updated}
          </p>

          {showToc && (
            <nav className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-5" aria-label={TOC_LABEL[lang]} data-testid="legal-toc">
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">{TOC_LABEL[lang]}</div>
              <ol className="mt-3 columns-1 gap-x-8 space-y-1.5 sm:columns-2">
                {page.sections.map((s, i) => (
                  <li key={sectionId(s, i)} className="break-inside-avoid text-[13px]">
                    <a href={`#${sectionId(s, i)}`} className="text-zinc-400 transition-colors hover:text-white">
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="mt-12 space-y-10">
            {page.sections.map((s, i) => (
              <SectionBlock key={sectionId(s, i)} s={s} index={i} />
            ))}
          </div>

          {page.related && page.related.length > 0 && (
            <aside className="mt-14 border-t border-white/10 pt-8" data-testid="legal-related">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">{RELATED_LABEL[lang]}</h2>
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {page.related.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href} className="text-sm text-zinc-400 underline-offset-4 transition-colors hover:text-white hover:underline">
                      {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          <p className="mt-12 text-xs leading-relaxed text-zinc-600" data-testid="legal-disclaimer">
            {disclaimer}
          </p>
        </div>
      </div>
    </main>
  );
}

/** Legacy flat (non-locale-prefixed) app/* route tree — resolves the page client-side via useLang(). */
export function LegalPageView({ slug }: { slug: string }) {
  const { lang } = useLang();
  const page = (lang === "nl" ? legalNl : legalDe)[slug];
  if (!page) return null;
  return <LegalPage page={page} lang={lang === "nl" ? "nl" : "de"} />;
}
