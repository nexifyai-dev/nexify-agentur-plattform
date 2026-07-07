"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const localeLabels: Record<string, string> = { de: "DE", en: "EN", nl: "NL" };

export function LocaleSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();

  const getLocalePath = (locale: string) => {
    const segments = pathname.split("/");
    segments[1] = locale;
    return segments.join("/");
  };

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Sprache wechseln">
      {Object.entries(localeLabels).map(([locale, label]) => (
        <Link
          key={locale}
          href={getLocalePath(locale)}
          className={cn(
            "px-2 py-1 font-mono text-[10px] uppercase tracking-[.08em] rounded-[4px] transition-all",
            locale === currentLocale
              ? "bg-[var(--border)] text-[var(--text-1)]"
              : "text-[var(--text-4)] hover:text-[var(--text-2)] hover:bg-[var(--border)]"
          )}
          aria-current={locale === currentLocale ? "true" : undefined}
          hrefLang={locale}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
