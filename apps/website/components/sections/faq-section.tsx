'use client';

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { faqs } from "@/lib/site-data";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="py-16 md:py-28">
      <div className="site-container">
        <Reveal>
          <span className="eyebrow">Häufig gefragt</span>
          <h2 className="mt-4 max-w-2xl font-[family-name:var(--font-heading)] text-3xl font-light tracking-tight text-white sm:text-4xl">
            Sie fragen — wir antworten direkt
          </h2>
        </Reveal>

        <div className="mx-auto mt-12 max-w-3xl divide-y divide-white/10">
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="py-5" data-testid={`faq-item-${i}`}>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="flex w-full items-center justify-between gap-4 text-left"
                  aria-expanded={openIndex === i}
                >
                  <span className="text-[15px] font-medium text-white">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-zinc-500 transition-transform duration-200 ${
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openIndex === i && (
                  <div className="mt-3 text-[14px] leading-relaxed text-zinc-400 animate-in slide-in-from-top-2 duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
