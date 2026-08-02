"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useLang } from "@/lib/lang-context";

export function StickyCta() {
  const { lang } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:hidden"
      data-testid="sticky-cta"
    >
      {/* Leave clear space on the right for the chat launcher (60px + margin). */}
      <div className="pointer-events-auto mx-auto flex max-w-lg pr-[4.75rem]">
        <Link
          href="/kontakt"
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black shadow-[0_8px_32px_rgba(0,0,0,.5)]"
          data-testid="sticky-cta-link"
        >
          {lang === "en" ? "Request project" : lang === "nl" ? "Project aanvragen" : "Projekt anfragen"}{" "}
          <ArrowRight className="size-4 shrink-0" />
        </Link>
      </div>
    </div>
  );
}
