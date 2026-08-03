'use client';

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { HeroVisual } from "@/components/hero-visual";
import { useContent } from "@/lib/content";

export function HeroSection() {
  const t = useContent();

  return (
    <section className="relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40 lg:pt-44">
      <div className="hero-grid-bg" />
      <div className="pointer-events-none absolute left-1/2 top-[-320px] h-[560px] w-[min(900px,140vw)] -translate-x-1/2 rounded-full bg-white/[0.05] blur-[140px]" />
      <div className="site-container relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400" data-testid="hero-badge">
            <span className="inline-block size-1.5 rounded-full bg-[#C8FF00] shadow-[0_0_8px_rgba(200,255,0,0.8)]" />
            {t.home.badge}
          </span>
        </Reveal>
        <Reveal delay={100}>
          <h1 className="mt-8 max-w-4xl font-[family-name:var(--font-heading)] text-[2.35rem] font-light leading-[1.08] tracking-tight text-white sm:text-5xl sm:leading-[1.05] lg:text-7xl">
            {t.home.titleA}
            <br />
            <span className="text-silver font-medium">{t.home.titleB}</span>
          </h1>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400">{t.home.subtitle}</p>
        </Reveal>
        <Reveal delay={300}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/kontakt" className="btn-primary" data-testid="hero-cta">
              {t.home.ctaPrimary} <ArrowRight size={16} />
            </Link>
            <Link href="/leistungen" className="btn-ghost" data-testid="hero-cta-secondary">
              {t.home.ctaSecondary}
            </Link>
          </div>
        </Reveal>
        </div>

        <Reveal delay={250}>
          <HeroVisual />
        </Reveal>
      </div>

      <div className="site-container relative">
        <Reveal delay={400}>
          <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:mt-20 lg:grid-cols-4" data-testid="hero-stats">
            {t.home.stats.map((s: { value: string; label: string }, i: number) => (
              <div key={i} className="bg-[#0c0c0f] p-5 sm:p-7">
                <div className="text-silver font-[family-name:var(--font-heading)] text-2xl font-semibold sm:text-3xl">{s.value}</div>
                <div className="mt-2 text-[12px] leading-snug text-zinc-500 sm:text-[13px]">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
