import Link from "next/link";
import { cn } from "@/lib/utils";

export function Brand({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label="NeXify AI Startseite" className={cn("inline-flex items-center gap-3", className)}>
      <span className="brand-mark" aria-hidden="true"><i /><b /></span>
      <span className="flex flex-col leading-none">
        <strong className="text-[17px] font-semibold tracking-[-0.035em] sm:text-[19px]">NeXify AI</strong>
        {!compact && <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.22em] text-white/38">chat it. Automate it.</span>}
      </span>
    </Link>
  );
}
