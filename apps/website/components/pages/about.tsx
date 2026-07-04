"use client";

import { Reveal } from "@/components/reveal";
import { useContent } from "@/lib/content";
import { LogoMark } from "@/components/logo";

export function AboutPage() {
  const t = useContent();

  return (
    <main className="pb-10 pt-36" data-testid="about-page">
      <div className="site-container">
        <Reveal>
          <span className="eyebrow">{t.about.eyebrow}</span>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">{t.about.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-400">{t.about.intro}</p>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <div className="glass h-full p-8 md:p-10">
              {t.about.paragraphs.map((p, i) => (
                <p key={i} className={`text-[15.5px] leading-[1.9] text-zinc-400 ${i > 0 ? "mt-5" : ""}`}>
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="glass flex h-full flex-col p-8 md:p-10">
              <div className="mx-auto py-6"><LogoMark size={96} /></div>
              <dl className="mt-4 space-y-4">
                {t.about.facts.map((f) => (
                  <div key={f.label} className="flex items-center justify-between border-b border-white/8 pb-4">
                    <dt className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{f.label}</dt>
                    <dd className="text-sm font-medium text-zinc-200">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <h2 className="mt-24 font-[family-name:var(--font-heading)] text-2xl font-medium text-white">{t.about.principlesTitle}</h2>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.about.principles.map((p, i) => (
            <Reveal key={i} delay={i * 90}>
              <div className="glass glass-lift h-full p-6" data-testid={`principle-card-${i}`}>
                <h3 className="text-[15px] font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-zinc-500">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
