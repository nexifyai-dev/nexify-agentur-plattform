import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-36 w-full resize-y rounded-[var(--r-sm)] border border-[var(--border)] bg-[var(--bg-page)] px-4 py-3 text-sm text-[var(--text-1)] outline-none placeholder:text-[var(--text-4)] focus:border-[var(--border-focus)] transition-colors duration-200",
        className,
      )}
      {...props}
    />
  );
}
