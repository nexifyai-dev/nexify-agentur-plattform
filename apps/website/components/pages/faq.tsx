"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { useContent } from "@/lib/content";

/** Turn path mentions like /preise into internal links inside FAQ answers. */
function AnswerWithLinks({ text }: { text: string }) {
  const parts = text.split(/(\/[a-z0-9äöüß/-]+)/gi);
  return (
    <p className="mt-3 text-[14.5px] leading-[1.85] text-zinc-400">
      {parts.map((part, i) => {
        if (part.startsWith("/") && /^\/[a-z0-9äöüß/-]+$/i.test(part)) {
          return (
            <Link
              key={`${part}-${i}`}
              href={part}
              className="text-zinc-200 underline decoration-white/25 underline-offset-4 transition-colors hover:text-white hover:decoration-white/60"
            >
              {part}
            </Link>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

export function FaqPage() {
  const t = useContent();
  const [open, setOpen] = useState<string | null>(`${t.faqCategories[0]?.id}-0`);

  return (
    <main className="pb-10 pt-28 md:pt-36" data-testid="faq-page">
      <div className="site-container">
        <Reveal>
          <span className="eyebrow">{t.faqPage.eyebrow}</span>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-4xl font-light tracking-tight text-white sm:text-5xl">
            {t.faqPage.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-400">{t.faqPage.intro}</p>
        </Reveal>

        <nav className="mt-10 flex flex-wrap gap-2" aria-label="FAQ Kategorien" data-testid="faq-category-nav">
          {t.faqCategories.map((cat) => (
            <a
              key={cat.id}
              href={`#faq-${cat.id}`}
              className="rounded-full border border-white/12 px-3.5 py-2 text-xs font-semibold text-zinc-400 transition-colors hover:border-white/30 hover:text-white"
              data-testid={`faq-nav-${cat.id}`}
            >
              {cat.title}
            </a>
          ))}
        </nav>

        <div className="mt-14 max-w-3xl space-y-14">
          {t.faqCategories.map((cat) => (
            <section key={cat.id} id={`faq-${cat.id}`} data-testid={`faq-section-${cat.id}`} className="scroll-mt-28">
              <Reveal>
                <h2 className="font-[family-name:var(--font-heading)] text-2xl font-medium tracking-tight text-white sm:text-3xl">
                  {cat.title}
                </h2>
              </Reveal>
              <div className="mt-6 space-y-3">
                {cat.items.map((f, i) => {
                  const key = `${cat.id}-${i}`;
                  const isOpen = open === key;
                  return (
                    <Reveal key={key} delay={Math.min(i * 30, 180)}>
                      <div
                        className={`glass overflow-hidden transition-colors ${isOpen ? "!border-white/20" : ""}`}
                        data-testid={`faq-item-${cat.id}-${i}`}
                      >
                        <button
                          type="button"
                          className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                          onClick={() => setOpen(isOpen ? null : key)}
                          aria-expanded={isOpen}
                          data-testid={`faq-toggle-${cat.id}-${i}`}
                        >
                          <h3 className="text-[15px] font-semibold text-white">{f.q}</h3>
                          <ChevronDown
                            size={17}
                            className={`shrink-0 text-zinc-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                            aria-hidden
                          />
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-6">
                            <AnswerWithLinks text={f.a} />
                          </div>
                        )}
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <Reveal>
          <section className="glass mt-20 p-8 text-center sm:p-12" data-testid="faq-cta">
            <h2 className="font-[family-name:var(--font-heading)] text-2xl font-light tracking-tight text-white sm:text-4xl">
              {t.faqPage.ctaTitle}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">{t.faqPage.ctaText}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/kontakt?utm_source=faq" className="btn-primary" data-testid="faq-cta-contact">
                {t.faqPage.ctaContact} <ArrowRight size={16} />
              </Link>
              <Link href="/preise#planner?utm_source=faq" className="btn-ghost" data-testid="faq-cta-planner">
                {t.faqPage.ctaPlanner}
              </Link>
              <Link href="/leistungen" className="btn-ghost !py-2.5 text-sm" data-testid="faq-cta-services">
                {t.faqPage.ctaServices}
              </Link>
              <Link href="/preise?utm_source=faq" className="btn-ghost !py-2.5 text-sm" data-testid="faq-cta-pricing">
                {t.faqPage.ctaPricing}
              </Link>
              <Link href="/wissen" className="btn-ghost !py-2.5 text-sm" data-testid="faq-cta-wissen">
                {t.faqPage.ctaKnowledge}
              </Link>
            </div>
          </section>
        </Reveal>
      </div>
    </main>
  );
}
