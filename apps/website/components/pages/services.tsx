"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { ICONS } from "@/components/icon-map";
import { useContent } from "@/lib/content";

export function ServicesPage() {
  const t = useContent();

  return (
    <main className="pb-10 pt-28 md:pt-36" data-testid="services-page">
      <div className="site-container">
        <Reveal>
          <span className="eyebrow">{t.servicesPage.eyebrow}</span>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">{t.servicesPage.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-400">{t.servicesPage.intro}</p>
        </Reveal>

        <div className="mt-16 space-y-8">
          {t.services.map((s, i) => {
            const Icon = ICONS[s.icon];
            return (
              <Reveal key={s.slug} delay={60}>
                <article className="glass overflow-hidden" data-testid={`service-detail-${s.slug}`} id={s.slug}>
                  <div className="grid gap-8 p-8 md:p-10 lg:grid-cols-[1.1fr_1fr]">
                    <div>
                      <div className="flex items-center gap-4">
                        <div className="flex size-12 items-center justify-center rounded-xl border border-white/12 bg-white/[0.04]">
                          <Icon size={22} className="text-zinc-300" />
                        </div>
                        <span className="rounded-full border border-white/12 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-zinc-400">{s.days}</span>
                        <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-600">{t.common.netPerDay}</span>
                      </div>
                      <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500">{s.eyebrow}</p>
                      <h2 className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-medium tracking-tight text-white sm:text-3xl">{s.title}</h2>
                      <p className="mt-4 leading-relaxed text-zinc-400">{s.description}</p>
                      <p className="mt-4 border-l-2 border-zinc-500 pl-4 text-[15px] font-medium italic text-zinc-300">{s.promise}</p>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {s.idealFor.map((x) => (
                          <span key={x} className="rounded-full bg-white/[0.05] px-3 py-1.5 text-xs text-zinc-400">
                            {x}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t.servicesPage.featuresLabel}</h3>
                        <ul className="mt-4 space-y-2.5">
                          {s.features.map((f) => (
                            <li key={f} className="flex gap-2.5 text-[13.5px] leading-snug text-zinc-400">
                              <Check size={14} className="mt-0.5 shrink-0 text-zinc-300" /> {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t.servicesPage.deliverablesLabel}</h3>
                        <ul className="mt-4 space-y-2.5">
                          {s.deliverables.map((d) => (
                            <li key={d} className="flex gap-2.5 text-[13.5px] leading-snug text-zinc-400">
                              <Check size={14} className="mt-0.5 shrink-0 text-zinc-300" /> {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <div className="mt-16 flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <p className="max-w-xl text-zinc-400">{t.pricing.vatNote}</p>
            <Link href="/kontakt" className="btn-primary" data-testid="services-cta">
              {t.common.cta} <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
