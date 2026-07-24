"use client";

import { Sparkles } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { ICONS } from "@/components/icon-map";
import { useContent } from "@/lib/content";

export function PlatformPage() {
  const t = useContent();

  return (
    <main className="pb-10 pt-28 md:pt-36" data-testid="platform-page">
      <div className="site-container">
        <Reveal>
          <span className="eyebrow">{t.platform.eyebrow}</span>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">{t.platform.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-400">{t.platform.intro}</p>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {t.platform.blocks.map((b, i) => {
            const Icon = ICONS[b.icon];
            return (
              <Reveal key={i} delay={(i % 2) * 100}>
                <div className="glass glass-lift h-full p-8" data-testid={`platform-block-${i}`}>
                  <div className="flex size-12 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04]">
                    <Icon size={22} className="text-zinc-300" />
                  </div>
                  <h2 className="mt-6 font-[family-name:var(--font-heading)] text-xl font-medium text-white">{b.title}</h2>
                  <p className="mt-2 text-[14.5px] text-zinc-500">{b.text}</p>
                  <ul className="mt-5 space-y-2.5">
                    {b.points.map((p) => (
                      <li key={p} className="flex gap-2.5 text-[13.5px] text-zinc-400">
                        <span className="mt-[8px] block size-1 shrink-0 rounded-full bg-zinc-400" /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="glass relative mt-16 overflow-hidden p-10 md:p-14" data-testid="nova-showcase">
            <div className="pointer-events-none absolute right-[-120px] top-[-120px] h-[320px] w-[320px] rounded-full bg-white/[0.06] blur-[90px]" />
            <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center">
              <div className="pulse-dot flex size-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zinc-200 to-zinc-500">
                <Sparkles size={26} className="text-black" />
              </div>
              <div>
                <h2 className="font-[family-name:var(--font-heading)] text-2xl font-medium text-white">{t.platform.novaTitle}</h2>
                <p className="mt-3 max-w-3xl leading-relaxed text-zinc-400">{t.platform.novaText}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
