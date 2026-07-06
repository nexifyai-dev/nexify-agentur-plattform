import Link from "next/link";
import { cn } from "@/lib/utils";

export function Brand({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link href="/de" aria-label="NeXify AI Startseite" className={cn("inline-flex items-center gap-3", className)}>
      <span className="brand-mark" aria-hidden="true"><i /><b /></span>
      <span className="flex flex-col leading-none">
        <strong className="text-[17px] font-semibold tracking-[-0.04em] sm:text-[19px]">NeXify AI</strong>
        {!compact && <span className="mt-1 font-mono text-[9px] font-normal uppercase tracking-[0.2em] text-[var(--text-4)]">chat it. Automate it.</span>}
      </span>
    </Link>
  );
}
