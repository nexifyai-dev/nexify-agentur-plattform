"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronDown, Clock3 } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { useContent } from "@/lib/content";
import { WISSEN_ARTICLES } from "@/lib/content/wissen-articles";

export function KnowledgePage() {
  const t = useContent();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <main className="pb-10 pt-28 md:pt-36" data-testid="knowledge-page">
      <div className="site-container">
        <Reveal>
          <span className="eyebrow">{t.wissen.eyebrow}</span>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">{t.wissen.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-400">{t.wissen.intro}</p>
        </Reveal>

        <section className="mt-16" aria-labelledby="wissen-featured-heading" data-testid="wissen-featured">
          <Reveal>
            <h2
              id="wissen-featured-heading"
              className="font-[family-name:var(--font-heading)] text-2xl font-medium tracking-tight text-white"
            >
              Artikel zum Weiterlesen
            </h2>
            <p className="mt-2 max-w-2xl text-[14.5px] text-zinc-500">
              Vollständige Beiträge mit festem Text im HTML — für Lesbarkeit und Auffindbarkeit.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {WISSEN_ARTICLES.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 2) * 90}>
                <article
                  className="glass glass-lift flex h-full flex-col p-8"
                  data-testid={`wissen-featured-${a.slug}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-white/12 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                      {a.tag}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-zinc-600">
                      <Clock3 size={12} /> {a.readTime}
                    </span>
                  </div>
                  <h3 className="mt-5 font-[family-name:var(--font-heading)] text-xl font-medium leading-snug text-white">
                    <Link
                      href={`/wissen/${a.slug}`}
                      className="transition-colors hover:text-zinc-200"
                    >
                      {a.title}
                    </Link>
                  </h3>
                  <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-zinc-500">{a.excerpt}</p>
                  <Link
                    href={`/wissen/${a.slug}`}
                    className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-zinc-300 transition-colors hover:text-white"
                    data-testid={`wissen-featured-link-${a.slug}`}
                  >
                    Artikel öffnen <ArrowRight size={14} />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <div className="mt-20 grid gap-6 md:grid-cols-2">
          {t.wissen.articles.map((a, i) => {
            const open = openIdx === i;
            return (
              <Reveal key={i} delay={(i % 2) * 90}>
                <article className="glass glass-lift h-full p-8" data-testid={`article-card-${i}`}>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-white/12 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">{a.tag}</span>
                    <span className="flex items-center gap-1.5 text-[11px] text-zinc-600">
                      <Clock3 size={12} /> {a.readTime}
                    </span>
                  </div>
                  <h2 className="mt-5 font-[family-name:var(--font-heading)] text-xl font-medium leading-snug text-white">{a.title}</h2>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-zinc-500">{a.excerpt}</p>
                  {open && (
                    <div className="mt-5 space-y-4 border-t border-white/10 pt-5">
                      {a.body.map((p, j) => (
                        <p key={j} className="text-[14.5px] leading-[1.85] text-zinc-400">
                          {p}
                        </p>
                      ))}
                    </div>
                  )}
                  <button
                    className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-zinc-300 transition-colors hover:text-white"
                    onClick={() => setOpenIdx(open ? null : i)}
                    data-testid={`article-toggle-${i}`}
                  >
                    {open ? t.wissen.readLess : t.wissen.readMore}
                    <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
                  </button>
                </article>
              </Reveal>
            );
          })}
        </div>

        <section className="mt-20" aria-labelledby="wissen-tools-heading" data-testid="wissen-tools">
          <Reveal>
            <h2
              id="wissen-tools-heading"
              className="font-[family-name:var(--font-heading)] text-2xl font-medium tracking-tight text-white"
            >
              Kostenlose KI-Rechner
            </h2>
            <p className="mt-2 max-w-2xl text-[14.5px] text-zinc-500">
              Zwei interaktive Tools, die Ihr Automatisierungspotenzial in 30 Sekunden beziffern —
              ohne Anmeldung, ohne Datenweitergabe.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Reveal>
              <article className="glass glass-lift flex h-full flex-col p-8" data-testid="knowledge-tool-roi">
                <span className="rounded-full border border-white/12 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Kostenloses Tool
                </span>
                <h3 className="mt-5 font-[family-name:var(--font-heading)] text-xl font-medium leading-snug text-white">
                  KI-ROI-Rechner
                </h3>
                <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-zinc-500">
                  Was sparen 20, 40 und 60&nbsp;% Automatisierung Ihrem Team pro Jahr? Gerechnet
                  wird ausschließlich mit Ihren Zahlen — Mitarbeiter, Stunden, Stundensatz.
                </p>
                <Link
                  href="/ki-roi-rechner"
                  className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-zinc-300 transition-colors hover:text-white"
                  data-testid="knowledge-tool-link-roi"
                >
                  Ersparnis berechnen <ArrowRight size={14} />
                </Link>
              </article>
            </Reveal>
            <Reveal>
              <article className="glass glass-lift flex h-full flex-col p-8" data-testid="knowledge-tool-chatbot">
                <span className="rounded-full border border-white/12 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  Kostenloses Tool
                </span>
                <h3 className="mt-5 font-[family-name:var(--font-heading)] text-xl font-medium leading-snug text-white">
                  Chatbot-Kosten-Rechner
                </h3>
                <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-zinc-500">
                  Eigenbau, Full-Service-Agentur oder NeXify KI-Begleiter? Vergleichen Sie die
                  einmaligen und 3-Jahres-Kosten mit Marktspannen 2026.
                </p>
                <Link
                  href="/chatbot-kosten-rechner"
                  className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-zinc-300 transition-colors hover:text-white"
                  data-testid="knowledge-tool-link-chatbot"
                >
                  Kosten vergleichen <ArrowRight size={14} />
                </Link>
              </article>
            </Reveal>
          </div>
        </section>
      </div>
    </main>
  );
}
