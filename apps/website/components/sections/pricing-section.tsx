'use client';

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { company, services } from "@/lib/site-data";

export function PricingSection() {
  return (
    <section className="py-16 md:py-28">
      <div className="site-container">
        <Reveal>
          <span className="eyebrow">Transparente Preisstruktur</span>
          <h2 className="mt-4 max-w-2xl font-[family-name:var(--font-heading)] text-3xl font-light tracking-tight text-white sm:text-4xl">
            {company.dayRate} € pro Arbeitstag — Sie wissen vorher, was es kostet
          </h2>
        </Reveal>

        <div className="mt-12 overflow-x-auto">
          <div className="grid gap-4 min-w-[600px] md:grid-cols-2 lg:grid-cols-4">
            {services.slice(0, 8).map((s, i) => (
              <Reveal key={s.slug} delay={i * 80}>
                <Link
                  href={`/leistungen#${s.slug}`}
                  className="glass glass-lift flex h-full flex-col p-6"
                  data-testid={`pricing-card-${s.slug}`}
                >
                  <h3 className="font-[family-name:var(--font-heading)] text-lg font-medium text-white">{s.shortTitle}</h3>
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-zinc-500">{s.eyebrow}</p>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-silver font-[family-name:var(--font-heading)] text-2xl font-semibold">{s.days}</span>
                    {s.minDays > 1 && <span className="text-xs text-zinc-500">· ab {s.minDays * company.dayRate} €</span>}
                    {s.minDays === 1 && <span className="text-xs text-zinc-500">· {company.dayRate} €</span>}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={600}>
          <div className="mt-12 text-center">
            <Link href="/preise?utm_source=home&utm_medium=organic&utm_campaign=home_preise" className="btn-primary inline-flex items-center gap-2" data-testid="pricing-cta">
              Alle Preise im Detail <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
