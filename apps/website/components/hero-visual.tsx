"use client";

import { Sparkles, Bot, FileText, Zap } from "lucide-react";
import { useLang } from "@/lib/lang-context";

export function HeroVisual() {
  const { lang } = useLang();
  const nl = lang === "nl";
  return (
    <div className="relative mx-auto hidden aspect-square w-full max-w-[540px] select-none lg:block" aria-hidden="true" data-testid="hero-visual">
      <svg viewBox="0 0 540 540" className="h-full w-full">
        <defs>
          <linearGradient id="hv-s" x1="0" y1="0" x2="540" y2="540" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fafafa" />
            <stop offset="0.5" stopColor="#71717a" />
            <stop offset="1" stopColor="#e4e4e7" />
          </linearGradient>
          <radialGradient id="hv-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="rgba(255,255,255,0.14)" />
            <stop offset="1" stopColor="transparent" />
          </radialGradient>
        </defs>

        <circle cx="270" cy="270" r="250" fill="url(#hv-glow)" />

        <g className="orbit-ring" style={{ transformOrigin: "270px 270px" }}>
          <circle cx="270" cy="270" r="235" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" className="dash-flow" />
          <circle cx="270" cy="35" r="6" fill="#0c0c0f" stroke="url(#hv-s)" strokeWidth="1.6" />
          <circle cx="505" cy="270" r="4" fill="url(#hv-s)" />
          <circle cx="270" cy="505" r="6" fill="#0c0c0f" stroke="url(#hv-s)" strokeWidth="1.6" />
          <circle cx="35" cy="270" r="4" fill="url(#hv-s)" />
        </g>

        <g className="orbit-ring-rev" style={{ transformOrigin: "270px 270px" }}>
          <circle cx="270" cy="270" r="172" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <circle cx="270" cy="98" r="7" fill="#0c0c0f" stroke="url(#hv-s)" strokeWidth="1.8" />
          <circle cx="418" cy="356" r="7" fill="#0c0c0f" stroke="url(#hv-s)" strokeWidth="1.8" />
          <circle cx="122" cy="356" r="7" fill="#0c0c0f" stroke="url(#hv-s)" strokeWidth="1.8" />
        </g>

        <g opacity="0.5">
          <line x1="270" y1="270" x2="270" y2="98" stroke="rgba(255,255,255,0.15)" strokeWidth="1" className="dash-flow" />
          <line x1="270" y1="270" x2="418" y2="356" stroke="rgba(255,255,255,0.15)" strokeWidth="1" className="dash-flow" />
          <line x1="270" y1="270" x2="122" y2="356" stroke="rgba(255,255,255,0.15)" strokeWidth="1" className="dash-flow" />
        </g>

        <g className="core-pulse">
          <path d="M270 160 366 215v110l-96 55-96-55V215l96-55Z" fill="rgba(12,12,15,0.9)" stroke="url(#hv-s)" strokeWidth="2" />
          <path d="M270 192 338 231v78l-68 39-68-39v-78l68-39Z" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          <path d="M232 232 308 308M308 232l-76 76" stroke="url(#hv-s)" strokeWidth="7" strokeLinecap="round" />
          <circle cx="232" cy="232" r="9" fill="#0c0c0f" stroke="url(#hv-s)" strokeWidth="3" />
          <circle cx="308" cy="232" r="9" fill="#0c0c0f" stroke="url(#hv-s)" strokeWidth="3" />
          <circle cx="232" cy="308" r="9" fill="#0c0c0f" stroke="url(#hv-s)" strokeWidth="3" />
          <circle cx="308" cy="308" r="9" fill="#0c0c0f" stroke="url(#hv-s)" strokeWidth="3" />
          <circle cx="270" cy="270" r="12" fill="url(#hv-s)" />
        </g>
      </svg>

      <div className="float-chip absolute -left-3 top-[18%] flex items-center gap-2.5 rounded-2xl border border-white/15 bg-black/60 px-4 py-3 backdrop-blur-xl">
        <Bot size={17} className="text-zinc-300" />
        <div>
          <div className="text-[12px] font-bold text-white">{nl ? "AI-adviseur actief" : "AI-Berater aktiv"}</div>
          <div className="text-[10px] text-zinc-500">{nl ? "24/7 · DE & NL" : "24/7 · DE & NL"}</div>
        </div>
        <span className="ml-1 inline-block size-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
      </div>

      <div className="float-chip absolute -right-2 top-[38%] flex items-center gap-2.5 rounded-2xl border border-white/15 bg-black/60 px-4 py-3 backdrop-blur-xl" style={{ animationDelay: "1.5s" }}>
        <FileText size={17} className="text-zinc-300" />
        <div>
          <div className="text-[12px] font-bold text-white">{nl ? "Offerte in 60 sec." : "Angebot in 60 Sek."}</div>
          <div className="text-[10px] text-zinc-500">{nl ? "direct per e-mail" : "direkt per E-Mail"}</div>
        </div>
      </div>

      <div className="float-chip absolute bottom-[10%] left-[12%] flex items-center gap-2.5 rounded-2xl border border-white/15 bg-black/60 px-4 py-3 backdrop-blur-xl" style={{ animationDelay: "3s" }}>
        <Zap size={17} className="text-zinc-300" />
        <div>
          <div className="text-[12px] font-bold text-white">{nl ? "Live in 1–3 dagen" : "Live in 1–3 Tagen"}</div>
          <div className="text-[10px] text-zinc-500">€ 999 / {nl ? "werkdag" : "Arbeitstag"}</div>
        </div>
      </div>

      <div className="float-chip absolute bottom-[28%] right-[6%]" style={{ animationDelay: "2.2s" }}>
        <div className="flex size-11 items-center justify-center rounded-full border border-white/20 bg-black/60 backdrop-blur-xl">
          <Sparkles size={17} className="text-zinc-200" />
        </div>
      </div>
    </div>
  );
}
