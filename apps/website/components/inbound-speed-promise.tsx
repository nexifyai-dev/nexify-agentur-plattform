// FILE: apps/website/components/inbound-speed-promise.tsx
// SESSION: neukunden-begeisterung-7dd5
import { Timer } from "lucide-react";
import { SPEED_PROMISE, type DelightLang } from "@/lib/delight-copy";

export function InboundSpeedPromise({
  lang = "de",
  className = "",
  testId = "inbound-speed-promise",
}: {
  lang?: DelightLang;
  className?: string;
  testId?: string;
}) {
  const t = SPEED_PROMISE[lang];
  return (
    <div
      className={`flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 ${className}`}
      data-testid={testId}
    >
      <Timer size={16} className="mt-0.5 shrink-0 text-zinc-400" aria-hidden />
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">{t.label}</p>
        <p className="mt-1 text-sm leading-relaxed text-zinc-400">{t.text}</p>
      </div>
    </div>
  );
}
