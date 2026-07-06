"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = dot.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;

    let x = 0, y = 0, cx = 0, cy = 0;
    const onMove = (e: MouseEvent) => { x = e.clientX; y = e.clientY; };
    const raf = () => {
      cx += (x - cx) * 0.15;
      cy += (y - cy) * 0.15;
      el.style.transform = `translate(${cx - 4}px, ${cy - 4}px)`;
      requestAnimationFrame(raf);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    const id = requestAnimationFrame(raf);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(id); };
  }, []);

  return (
    <div
      ref={dot}
      className="pointer-events-none fixed top-0 left-0 z-[9999] hidden size-2 rounded-full mix-blend-mode-difference lg:block"
      style={{ background: "rgba(255,255,255,.8)", willChange: "transform" }}
    />
  );
}
