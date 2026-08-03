'use client';

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { ICONS } from "@/components/icon-map";
import { useContent } from "@/lib/content";

export function ServicesSection() {
  const t = useContent();

  return (
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
          {t.services.map((s: { slug: string; icon: string; days: string; title: string; eyebrow: string }, i: number) => {
            const Icon = ICONS[s.icon];
            return (
              <Reveal key={s.slug} delay={(i % 4) * 90}>
                <Link href={`/leistungen#${s.slug}`} className={`glass glass-lift block h-full p-6 ${i === 0 || i === 5 ? "lg:col-span-2" : ""}`} data-testid={`service-card-${s.slug}`}>
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
  );
}
