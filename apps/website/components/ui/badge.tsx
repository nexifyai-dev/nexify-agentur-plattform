import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full border border-white/10 bg-white/[.025] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-white/60",
        className,
      )}
      {...props}
    />
  );
}
