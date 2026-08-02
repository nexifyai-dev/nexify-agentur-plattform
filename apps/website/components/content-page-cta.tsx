"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { useContent } from "@/lib/content";

/** Bottom-of-page CTA for Wissen / content surfaces (blog track may add /blog later). */
export function ContentPageCta() {
  const t = useContent();
  const c = t.wissen.cta;

  return (
    <Reveal>
      <div
        className="glass mt-20 overflow-hidden p-8 text-center sm:p-12"
        data-testid="content-page-cta"
      >
        <h2 className="font-[family-name:var(--font-heading)] text-2xl font-light tracking-tight text-white sm:text-3xl">
          {c.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-zinc-400">{c.text}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/kontakt" className="btn-primary" data-testid="content-cta-kontakt">
            {c.primary} <ArrowRight size={16} />
          </Link>
          <Link href="/leistungen" className="btn-ghost !py-2.5 text-sm" data-testid="content-cta-leistungen">
            {c.secondary}
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
