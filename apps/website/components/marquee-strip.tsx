import { cn } from "@/lib/utils";

interface MarqueeStripProps {
  items: string[];
  className?: string;
  speed?: number;
}

export function MarqueeStrip({ items, className = "", speed = 30 }: MarqueeStripProps) {
  const content = items.join(" · ");
  return (
    <div className={cn("overflow-hidden border-y border-[var(--border)] bg-[var(--bg-elevated)] py-3", className)}>
      <div
        className="flex whitespace-nowrap"
        style={{ animation: `marquee ${speed}s linear infinite` }}
      >
        {[0, 1, 2].map((i) => (
          <span key={i} className="mr-12 font-mono text-[11px] uppercase tracking-[.14em] text-[var(--text-4)]">
            {content}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
