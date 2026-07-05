"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { useContent } from "@/lib/content";

export function FaqPage() {
  const t = useContent();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <main className="pb-10 pt-28 md:pt-36" data-testid="faq-page">
      <div className="site-container">
        <Reveal>
          <span className="eyebrow">{t.faqPage.eyebrow}</span>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">{t.faqPage.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-400">{t.faqPage.intro}</p>
        </Reveal>

        <div className="mt-14 max-w-3xl space-y-3">
          {t.faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={i} delay={Math.min(i * 40, 240)}>
                <div className={`glass overflow-hidden transition-colors ${isOpen ? "!border-white/20" : ""}`}>
                  <button
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    onClick={() => setOpen(isOpen ? null : i)}
                    data-testid={`faq-item-${i}`}
                  >
                    <span className="text-[15px] font-semibold text-white">{f.q}</span>
                    <ChevronDown size={17} className={`shrink-0 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && <p className="px-6 pb-6 text-[14.5px] leading-[1.85] text-zinc-400">{f.a}</p>}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </main>
  );
}
