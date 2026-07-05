"use client";

import { Reveal } from "@/components/reveal";
import { ICONS } from "@/components/icon-map";
import { useContent } from "@/lib/content";

export function ProcessPage() {
  const t = useContent();

  return (
    <main className="pb-10 pt-28 md:pt-36" data-testid="process-page">
      <div className="site-container">
        <Reveal>
          <span className="eyebrow">{t.process.eyebrow}</span>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">{t.process.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-400">{t.process.intro}</p>
        </Reveal>

        <div className="relative mt-20">
          <div className="absolute left-[27px] top-0 hidden h-full w-px bg-gradient-to-b from-white/25 via-white/10 to-transparent md:block" />
          <div className="space-y-10">
            {t.process.steps.map((s, i) => {
              const Icon = ICONS[s.icon];
              return (
                <Reveal key={s.n} delay={i * 80}>
                  <div className="relative flex gap-8" data-testid={`process-detail-${s.n}`}>
                    <div className="relative z-10 hidden size-14 shrink-0 items-center justify-center rounded-full border border-white/15 bg-[#0c0c0f] md:flex">
                      <Icon size={20} className="text-zinc-300" />
                    </div>
                    <div className="glass glass-lift flex-1 p-8">
                      <div className="flex items-center gap-4">
                        <span className="text-silver font-[family-name:var(--font-heading)] text-3xl font-semibold">{s.n}</span>
                        <h2 className="font-[family-name:var(--font-heading)] text-xl font-medium text-white">{s.title}</h2>
                      </div>
                      <p className="mt-3 max-w-3xl leading-relaxed text-zinc-400">{s.text}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        <Reveal>
          <h2 className="mt-28 font-[family-name:var(--font-heading)] text-2xl font-medium text-white">{t.process.promiseTitle}</h2>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.process.promises.map((p, i) => (
            <Reveal key={i} delay={i * 90}>
              <div className="glass h-full p-6" data-testid={`promise-card-${i}`}>
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
