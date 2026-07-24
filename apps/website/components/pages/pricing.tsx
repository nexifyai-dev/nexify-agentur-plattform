"use client";

import { useMemo, useState } from "react";
import { Check, Minus } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { ProjectPlanner } from "@/components/project-planner";
import { useContent } from "@/lib/content";

const fmt = (n: number) => `€ ${n.toLocaleString("de-DE")}`;

export function PricingPage() {
  const t = useContent();
  const [serviceIdx, setServiceIdx] = useState(1);
  const svc = t.services[serviceIdx];
  const min = svc.minDays;
  const max = svc.maxDays ?? Math.max(svc.minDays * 2, svc.minDays + 6);
  const [days, setDays] = useState(min);
  const clamped = Math.min(Math.max(days, min), max);
  const net = clamped * 999;
  const vat = Math.round(net * 0.21);
  const fill = useMemo(() => (max === min ? 100 : ((clamped - min) / (max - min)) * 100), [clamped, min, max]);

  return (
    <main className="pb-10 pt-28 md:pt-36" data-testid="pricing-page">
      <div className="site-container">
        <Reveal>
          <span className="eyebrow">{t.pricing.eyebrow}</span>
          <h1 className="mt-4 font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">{t.pricing.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-400">{t.pricing.intro}</p>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <div className="glass flex h-full flex-col p-8 md:p-10" data-testid="dayrate-card">
              <div className="text-silver font-[family-name:var(--font-heading)] text-6xl font-semibold">€ 999</div>
              <div className="mt-2 text-sm uppercase tracking-[0.2em] text-zinc-500">{t.common.netPerDay.replace("€ 999 netto / ", "netto / ")}</div>
              <h2 className="mt-8 font-[family-name:var(--font-heading)] text-xl font-medium text-white">{t.pricing.dayRateTitle}</h2>
              <p className="mt-3 text-[14.5px] leading-relaxed text-zinc-400">{t.pricing.dayRateText}</p>
              <div className="mt-auto grid gap-6 pt-8 sm:grid-cols-2">
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t.pricing.includedTitle}</h3>
                  <ul className="mt-3 space-y-2">
                    {t.pricing.included.map((x) => (
                      <li key={x} className="flex gap-2 text-[13px] text-zinc-400">
                        <Check size={13} className="mt-0.5 shrink-0 text-emerald-400/80" /> {x}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t.pricing.notIncludedTitle}</h3>
                  <ul className="mt-3 space-y-2">
                    {t.pricing.notIncluded.map((x) => (
                      <li key={x} className="flex gap-2 text-[13px] text-zinc-500">
                        <Minus size={13} className="mt-0.5 shrink-0 text-zinc-600" /> {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="glass h-full p-8 md:p-10" data-testid="pricing-calculator">
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-medium text-white">{t.pricing.calcTitle}</h2>
              <p className="mt-2 text-sm text-zinc-500">{t.pricing.calcText}</p>

              <label className="mt-8 block text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t.pricing.calcService}</label>
              <div className="mt-3 flex flex-wrap gap-2">
                {t.services.map((s, i) => (
                  <button
                    key={s.slug}
                    onClick={() => {
                      setServiceIdx(i);
                      setDays(s.minDays);
                    }}
                    data-testid={`calc-service-${s.slug}`}
                    className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition-all ${
                      i === serviceIdx ? "border-white/60 bg-white text-black" : "border-white/12 text-zinc-400 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {s.shortTitle}
                  </button>
                ))}
              </div>

              <div className="mt-8 flex items-end justify-between">
                <label className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t.pricing.calcDays}</label>
                <span className="text-silver font-[family-name:var(--font-heading)] text-3xl font-semibold" data-testid="calc-days-value">
                  {clamped} {svc.from ? "+" : ""}
                </span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                value={clamped}
                onChange={(e) => setDays(Number(e.target.value))}
                className="range-silver mt-4"
                style={{ ["--fill" as string]: `${fill}%` }}
                data-testid="calc-days-slider"
              />
              <div className="mt-1 flex justify-between text-[11px] text-zinc-600">
                <span>{min}</span>
                <span>{max}{svc.from ? "+" : ""}</span>
              </div>

              <div className="mt-8 space-y-3 rounded-2xl border border-white/10 bg-black/30 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">{t.pricing.calcNet}</span>
                  <span className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-white" data-testid="calc-net-price">{fmt(net)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">{t.pricing.calcVat}</span>
                  <span className="text-zinc-400">{fmt(vat)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-3 text-sm">
                  <span className="text-zinc-500">{t.pricing.calcGross}</span>
                  <span className="text-zinc-300">{fmt(net + vat)}</span>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-zinc-600">{t.pricing.calcNote}</p>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.services.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 4) * 80}>
              <div className="glass glass-lift h-full p-6" data-testid={`price-card-${s.slug}`}>
                <h3 className="text-[15px] font-semibold text-white">{s.shortTitle}</h3>
                <div className="mt-3 font-[family-name:var(--font-heading)] text-2xl font-semibold text-zinc-200">
                  {s.from ? `${t.common.from} ` : ""}
                  {fmt(s.minDays * 999)}
                  {!s.from && s.maxDays && s.maxDays !== s.minDays ? ` – ${fmt(s.maxDays * 999)}` : ""}
                </div>
                <div className="mt-1 text-xs text-zinc-500">{s.days}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-16">
            <ProjectPlanner />
          </div>
        </Reveal>

        <p className="mt-10 text-sm text-zinc-600">{t.pricing.vatNote}</p>
      </div>
    </main>
  );
}
