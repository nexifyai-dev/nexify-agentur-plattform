import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-36 w-full resize-y rounded-xl border border-white/10 bg-[#0d1012] px-4 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[rgba(255,100,23,.7)] focus:ring-2 focus:ring-[rgba(255,100,23,.2)]",
        className,
      )}
      {...props}
    />
  );
}
