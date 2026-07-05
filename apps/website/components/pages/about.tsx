"use client";

import { Reveal } from "@/components/reveal";
import { useContent } from "@/lib/content";
import { LogoMark } from "@/components/logo";

export function AboutPage() {
  const t = useContent();

  return (
    <main className="pb-10 pt-28 md:pt-36" data-testid="about-page">
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
            <div className="glass flex h-full flex-col overflow-hidden">
              <div className="relative flex items-end justify-end bg-[radial-gradient(ellipse_60%_50%_at_70%_100%,rgba(255,255,255,0.08),transparent)] pt-8">
                <div className="absolute bottom-6 left-6 z-10 max-w-[45%]">
                  <LogoMark size={30} />
                  <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Chat it.<br />Automate it.</div>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 backdrop-blur-xl">
                    <span className="inline-block size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <span className="text-[10px] font-semibold text-zinc-300">{t.about.eyebrow === "Over mij" ? "Persoonlijk bereikbaar" : "Persönlich erreichbar"}</span>
                  </div>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/pascal.png" alt="Pascal Courbois – Inhaber NeXify AI" loading="lazy" className="w-72 max-w-[70%] object-contain object-right-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.7)]" data-testid="about-portrait" />
              </div>
              <div className="border-t border-white/10 p-8">
                <div className="font-[family-name:var(--font-heading)] text-lg font-semibold text-white">Pascal Courbois</div>
                <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">{t.about.eyebrow === "Over mij" ? "Eigenaar · NeXify AI by NeXify" : "Inhaber · NeXify AI by NeXify"}</div>
                <dl className="mt-6 space-y-4">
                  {t.about.facts.map((f) => (
                    <div key={f.label} className="flex items-center justify-between border-b border-white/8 pb-3">
                      <dt className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{f.label}</dt>
                      <dd className="text-sm font-medium text-zinc-200">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <h2 className="mt-24 font-[family-name:var(--font-heading)] text-2xl font-medium text-white">{t.about.journeyTitle}</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-zinc-400">{t.about.journeyIntro}</p>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.about.journey.map((j, i) => (
            <Reveal key={i} delay={i * 90}>
              <div className="glass glass-lift h-full p-6" data-testid={`journey-card-${i}`}>
                <div className="font-[family-name:var(--font-heading)] text-3xl font-light text-zinc-700">0{i + 1}</div>
                <h3 className="mt-3 text-[15px] font-semibold text-white">{j.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-zinc-500">{j.text}</p>
              </div>
            </Reveal>
          ))}
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
