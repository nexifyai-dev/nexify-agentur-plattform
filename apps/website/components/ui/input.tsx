import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-[var(--r-sm)] border border-[var(--border)] bg-[var(--bg-page)] px-4 text-sm text-[var(--text-1)] outline-none placeholder:text-[var(--text-4)] focus:border-[var(--border-focus)] transition-colors duration-200",
        className,
      )}
      {...props}
    />
  );
}
