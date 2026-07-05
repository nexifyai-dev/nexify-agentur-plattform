"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Quote } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { ICONS } from "@/components/icon-map";
import { LogoMark } from "@/components/logo";
import { HeroVisual } from "@/components/hero-visual";
import { useContent } from "@/lib/content";

export function HomePage() {
  const t = useContent();

  return (
    <main data-testid="home-page">
      {/* HERO */}
      <section className="relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-40 lg:pt-44">
        <div className="hero-grid-bg" />
        <div className="pointer-events-none absolute left-1/2 top-[-320px] h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-white/[0.05] blur-[140px]" />
        <div className="site-container relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400" data-testid="hero-badge">
              <span className="inline-block size-1.5 rounded-full bg-emerald-400" />
              {t.home.badge}
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-8 max-w-4xl font-[family-name:var(--font-heading)] text-5xl font-light leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
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
              {t.home.stats.map((s, i) => (
                <div key={i} className="bg-[#0c0c0f] p-7">
                  <div className="text-silver font-[family-name:var(--font-heading)] text-3xl font-semibold">{s.value}</div>
                  <div className="mt-2 text-[13px] leading-snug text-zinc-500">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-white/8 bg-black/30 py-5 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="overflow-hidden">
          <div className="marquee">
            {[...t.home.marquee, ...t.home.marquee].map((m, i) => (
              <span key={i} className="whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.25em] text-zinc-600">
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="py-16 md:py-28">
        <div className="site-container">
          <Reveal>
            <span className="eyebrow">{t.home.pillarsEyebrow}</span>
            <h2 className="mt-4 max-w-2xl font-[family-name:var(--font-heading)] text-3xl font-light tracking-tight text-white sm:text-4xl">{t.home.pillarsTitle}</h2>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {t.home.pillars.map((p, i) => {
              const Icon = ICONS[p.icon];
              return (
                <Reveal key={i} delay={i * 120}>
                  <div className="glass glass-lift h-full p-8" data-testid={`pillar-card-${i}`}>
                    <div className="flex size-12 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04]">
                      <Icon size={22} className="text-zinc-300" />
                    </div>
                    <h3 className="mt-6 font-[family-name:var(--font-heading)] text-xl font-medium text-white">{p.title}</h3>
                    <p className="mt-3 text-[14.5px] leading-relaxed text-zinc-500">{p.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICES BENTO */}
      <section className="py-12 md:py-16">
        <div className="site-container">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div>
                <span className="eyebrow">{t.home.servicesEyebrow}</span>
                <h2 className="mt-4 max-w-2xl font-[family-name:var(--font-heading)] text-3xl font-light tracking-tight text-white sm:text-4xl">{t.home.servicesTitle}</h2>
                <p className="mt-4 max-w-xl text-zinc-500">{t.home.servicesText}</p>
              </div>
              <Link href="/leistungen" className="btn-ghost !py-2.5 text-sm" data-testid="home-all-services">
                {t.common.allServices} <ArrowUpRight size={15} />
              </Link>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.services.map((s, i) => {
              const Icon = ICONS[s.icon];
              return (
                <Reveal key={s.slug} delay={(i % 4) * 90}>
                  <Link href="/leistungen" className={`glass glass-lift block h-full p-6 ${i === 0 || i === 5 ? "lg:col-span-2" : ""}`} data-testid={`service-card-${s.slug}`}>
                    <div className="flex items-start justify-between">
                      <Icon size={22} className="text-zinc-300" />
                      <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500">{s.days}</span>
                    </div>
                    <h3 className="mt-5 font-[family-name:var(--font-heading)] text-lg font-medium leading-snug text-white">{s.title}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-zinc-500">{s.eyebrow}</p>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROCESS PREVIEW */}
      <section className="py-16 md:py-28">
        <div className="site-container">
          <Reveal>
            <span className="eyebrow">{t.home.processEyebrow}</span>
            <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-light tracking-tight text-white sm:text-4xl">{t.home.processTitle}</h2>
          </Reveal>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-5">
            {t.process.steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 90} className="h-full">
                <div className="h-full bg-[#0c0c0f] p-6 transition-colors hover:bg-[#101014]" data-testid={`process-step-${s.n}`}>
                  <div className="text-silver font-[family-name:var(--font-heading)] text-2xl font-semibold">{s.n}</div>
                  <h3 className="mt-4 text-[15px] font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-zinc-500">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTES */}
      <section className="py-12 md:py-16">
        <div className="site-container">
          <Reveal>
            <span className="eyebrow">{t.home.quotesEyebrow}</span>
            <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-light tracking-tight text-white sm:text-4xl">{t.home.quotesTitle}</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {t.references.quotes.map((q, i) => (
              <Reveal key={i} delay={i * 120}>
                <figure className="glass h-full p-8">
                  <Quote size={22} className="text-zinc-600" />
                  <blockquote className="mt-5 text-[15px] leading-relaxed text-zinc-300">„{q.quote}“</blockquote>
                  <figcaption className="mt-5 text-xs uppercase tracking-[0.15em] text-zinc-600">{q.author}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="py-16 md:py-28">
        <div className="site-container">
          <Reveal>
            <div className="glass relative overflow-hidden p-12 text-center md:p-20" data-testid="cta-band">
              <div className="pointer-events-none absolute left-1/2 top-[-160px] h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-white/[0.06] blur-[100px]" />
              <div className="relative">
                <div className="mx-auto mb-8 w-fit"><LogoMark size={56} /></div>
                <h2 className="mx-auto max-w-2xl font-[family-name:var(--font-heading)] text-3xl font-light tracking-tight text-white sm:text-5xl">{t.home.ctaBandTitle}</h2>
                <p className="mx-auto mt-6 max-w-xl text-zinc-400">{t.home.ctaBandText}</p>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                  <Link href="/kontakt" className="btn-primary" data-testid="cta-band-btn">
                    {t.home.ctaBandBtn} <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
