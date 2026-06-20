import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
};

export function Button({ asChild, className, variant = "default", size = "default", ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[11px] border text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:pointer-events-none disabled:opacity-55",
        variant === "default" && "border-transparent bg-[linear-gradient(135deg,var(--accent),var(--accent-2))] text-[#0b0b0b] shadow-[0_14px_34px_rgba(255,100,23,.22)] hover:brightness-110",
        variant === "outline" && "border-white/15 bg-transparent text-white hover:border-white/30 hover:bg-white/[.04]",
        variant === "ghost" && "border-transparent bg-transparent text-white/70 hover:bg-white/[.04] hover:text-white",
        size === "default" && "h-11 px-5",
        size === "sm" && "h-9 px-3 text-xs",
        size === "lg" && "h-12 px-6 text-[13px]",
        size === "icon" && "size-10 p-0",
        className,
      )}
      {...props}
    />
  );
}
