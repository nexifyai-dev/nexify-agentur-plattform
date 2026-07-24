import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 font-mono text-[10px] font-normal uppercase tracking-[.16em] text-[var(--text-3)]",
        className,
      )}
      {...props}
    />
  );
}
