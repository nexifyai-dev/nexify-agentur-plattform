'use client';

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { LogoMark } from "@/components/logo";
import { useContent } from "@/lib/content";

export function CtaSection() {
  const t = useContent();

  return (
    <section className="py-16 md:py-28">
      <div className="site-container">
        <Reveal>
          <div className="glass relative overflow-hidden p-6 text-center sm:p-12 md:p-20" data-testid="cta-band">
            <div className="pointer-events-none absolute left-1/2 top-[-160px] h-[300px] w-[min(600px,120vw)] -translate-x-1/2 rounded-full bg-white/[0.06] blur-[100px]" />
            <div className="relative">
              <div className="mx-auto mb-8 w-fit"><LogoMark size={56} /></div>
              <h2 className="mx-auto max-w-2xl font-[family-name:var(--font-heading)] text-2xl font-light tracking-tight text-white sm:text-5xl">{t.home.ctaBandTitle}</h2>
              <p className="mx-auto mt-6 max-w-xl text-zinc-400">{t.home.ctaBandText}</p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link href="/kontakt?utm_source=home&utm_medium=organic&utm_campaign=home_kontakt" className="btn-primary" data-testid="cta-band-btn">
                  {t.home.ctaBandBtn} <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
