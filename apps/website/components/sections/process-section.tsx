'use client';

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { useContent } from "@/lib/content";

export function ProcessSection() {
  const t = useContent();

  return (
    <section className="py-16 md:py-28">
      <div className="site-container">
        <Reveal>
          <span className="eyebrow">{t.home.processEyebrow}</span>
          <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-light tracking-tight text-white sm:text-4xl">{t.home.processTitle}</h2>
        </Reveal>
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3 lg:grid-cols-6">
          {t.process.steps.map((s: { n: string; title: string; text: string }, i: number) => (
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
  );
}
