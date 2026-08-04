"use client";

import { Quote, TrendingUp, Video } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { useContent } from "@/lib/content";

export function ReferencesPage() {
  const t = useContent();
  const vcs = t.references.videoCaseStudy;

  return (
    <main className="pb-10 pt-28 md:pt-36" data-testid="references-page">
      <div className="site-container">
        <Reveal>
          <span className="eyebrow">{t.references.eyebrow}</span>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">{t.references.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-400">{t.references.intro}</p>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {t.references.cases.map((c, i) => (
            <Reveal key={i} delay={i * 100}>
              <article className="glass glass-lift flex h-full flex-col p-8" data-testid={`case-card-${i}`}>
                <span className="w-fit rounded-full border border-white/12 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400">{c.tag}</span>
                <h2 className="mt-5 font-[family-name:var(--font-heading)] text-xl font-medium text-white">{c.title}</h2>
                <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-zinc-500">{c.text}</p>
                <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-5">
                  {c.results.map((r) => (
                    <li key={r} className="flex gap-2.5 text-[13.5px] font-medium text-zinc-300">
                      <TrendingUp size={14} className="mt-0.5 shrink-0 text-emerald-400/80" /> {r}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {t.references.quotes.map((q, i) => (
            <Reveal key={i} delay={i * 100}>
              <figure className="glass h-full p-8">
                <Quote size={22} className="text-zinc-600" />
                <blockquote className="mt-5 text-[15px] leading-relaxed text-zinc-300">„{q.quote}"</blockquote>
                <figcaption className="mt-5 text-xs uppercase tracking-[0.15em] text-zinc-600">{q.author}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* Video Case Study — human-gated: requires customer permission, shoot and claim approval */}
        <Reveal>
          <section className="mt-24 border-t border-white/10 pt-16" data-testid="video-case-study-section">
            <div className="flex items-center gap-3">
              <Video size={18} className="text-zinc-500" />
              <span className="eyebrow">{vcs.eyebrow}</span>
            </div>
            <h2 className="mt-4 max-w-2xl font-[family-name:var(--font-heading)] text-3xl font-light tracking-tight text-white sm:text-4xl">{vcs.title}</h2>
            <p className="mt-4 max-w-xl text-[15px] text-zinc-400">{vcs.intro}</p>

            <div className="mt-10 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-amber-400">
                {vcs.comingSoonLabel}
              </span>
              <p className="mt-5 text-[14.5px] leading-relaxed text-zinc-500">{vcs.comingSoonText}</p>
              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="text-sm text-zinc-400">{vcs.contactCta}</p>
                <a
                  href={vcs.contactHref}
                  className="mt-3 inline-block rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/40 hover:bg-white/5"
                >
                  {vcs.contactLabel}
                </a>
              </div>
            </div>
          </section>
        </Reveal>
      </div>
    </main>
  );
}
