'use client';

import { Quote } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { useContent } from "@/lib/content";

export function ReferencesSection() {
  const t = useContent();

  return (
    <section className="py-12 md:py-16">
      <div className="site-container">
        <Reveal>
          <span className="eyebrow">{t.home.quotesEyebrow}</span>
          <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-light tracking-tight text-white sm:text-4xl">{t.home.quotesTitle}</h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {t.references.quotes.map((q: { quote: string; author: string }, i: number) => (
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
  );
}
