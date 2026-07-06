"use client";

import { useState } from "react";
import { ChevronDown, Clock3 } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { useContent } from "@/lib/content";

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

        <div className="mt-16 grid gap-6 md:grid-cols-2">
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
      </div>
    </main>
  );
}
