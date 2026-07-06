"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden">
      <Link
        href="/kontakt"
        className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-sm font-medium shadow-[0_8px_32px_rgba(0,0,0,.5)]"
      >
        Projekt anfragen <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
