"use client";

import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { useContent } from "@/lib/content";

/**
 * Public GitHub social proof — topics/homepage only, no secrets.
 * Parent supplies layout width (site-container).
 */
export function GithubSocialProof() {
  const t = useContent();
  const g = t.home.githubProof;

  return (
    <div data-testid="github-social-proof">
      <Reveal>
        <span className="eyebrow">{g.eyebrow}</span>
        <h2 className="mt-4 max-w-2xl font-[family-name:var(--font-heading)] text-3xl font-light tracking-tight text-white sm:text-4xl">
          {g.title}
        </h2>
        <p className="mt-4 max-w-2xl text-zinc-500">{g.text}</p>
      </Reveal>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {g.items.map((item, i) => (
          <Reveal key={item.label} delay={i * 80}>
            <div
              className="glass flex h-full flex-col p-6"
              data-testid={`github-proof-item-${i}`}
            >
              <div className="text-silver font-[family-name:var(--font-heading)] text-xl font-semibold">
                {item.value}
              </div>
              <div className="mt-2 text-[13px] leading-snug text-zinc-500">{item.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={200}>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="https://github.com/nexifyai-dev/nexify-agentur-plattform"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost inline-flex items-center gap-2 !py-2.5 text-sm"
            data-testid="github-proof-repo-link"
          >
            <Github size={16} /> {g.repoCta} <ArrowUpRight size={14} />
          </a>
          <Link
            href="/referenzen"
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
            data-testid="github-proof-cases-link"
          >
            {g.casesCta} →
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
