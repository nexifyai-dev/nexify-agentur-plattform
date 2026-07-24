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
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--r-sm)] border text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--border-focus)] disabled:pointer-events-none disabled:opacity-30",
        variant === "default" && "border-[var(--border-hover)] bg-[var(--border)] text-[var(--text-1)] hover:bg-[var(--border-hover)] hover:text-[var(--text-1)] active:scale-[0.98]",
        variant === "outline" && "border-[var(--border)] bg-transparent text-[var(--text-2)] hover:border-[var(--border-hover)] hover:text-[var(--text-1)] hover:bg-[var(--border)]",
        variant === "ghost" && "border-transparent bg-transparent text-[var(--text-3)] hover:bg-[var(--border)] hover:text-[var(--text-2)]",
        size === "default" && "h-10 px-5",
        size === "sm" && "h-8 px-3 text-xs",
        size === "lg" && "h-11 px-6 text-[13px]",
        size === "icon" && "size-9 p-0",
        className,
      )}
      {...props}
    />
  );
}
