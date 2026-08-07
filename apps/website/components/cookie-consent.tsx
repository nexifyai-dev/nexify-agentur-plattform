// apps/website/components/cookie-consent.tsx
// TDDDG §25 / DSGVO-konformes Cookie-Banner
// Minimal — keine externen Abhängigkeiten
// Stand: 2026-08-06

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const STORAGE_KEY = "nexifyai-cookie-consent";
const CONSENT_VERSION = 1;

type ConsentState = "pending" | "accepted" | "essential-only";

function getStoredConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data?.version !== CONSENT_VERSION) return null;
    return data.state as ConsentState;
  } catch {
    return null;
  }
}

function storeConsent(state: ConsentState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state, version: CONSENT_VERSION, ts: Date.now() })
    );
  } catch { /* localStorage nicht verfügbar */ }
}

export function CookieConsent() {
  const [state, setState] = useState<ConsentState>("pending");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) {
      setState(stored);
    }
    setMounted(true);

    // Footer-Button ("Cookie-Einstellungen") öffnet das Banner erneut.
    const open = () => setState("pending");
    window.addEventListener("nexify-open-consent", open);
    return () => window.removeEventListener("nexify-open-consent", open);
  }, []);

  const accept = useCallback(() => {
    storeConsent("accepted");
    setState("accepted");
  }, []);

  const essentialOnly = useCallback(() => {
    storeConsent("essential-only");
    setState("essential-only");
  }, []);

  if (!mounted || state !== "pending") return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie-Einstellungen"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[9999] border-t border-white/10 bg-[#09090b]/95 p-4 backdrop-blur-xl sm:p-6"
    >
      <div className="pointer-events-auto mx-auto mb-[4.5rem] max-w-2xl flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        <div className="flex-1 text-sm text-zinc-400">
          <p className="font-semibold text-white">Cookie-Einstellungen</p>
          <p className="mt-1">
            Wir nutzen essenzielle Cookies für die technische Bereitstellung
            sowie — mit Ihrer Einwilligung — optionale Cookies für den
            KI-Berater-Chat. Kein Tracking, keine Werbenetzwerke.{" "}
            <Link
              href="/datenschutz"
              className="underline hover:text-white"
            >
              Datenschutzerklärung
            </Link>
            {" · "}
            <Link
              href="/cookie-richtlinie"
              className="underline hover:text-white"
            >
              Cookie-Richtlinie
            </Link>
            {" · "}
            <Link
              href="/impressum"
              className="underline hover:text-white"
            >
              Impressum
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={essentialOnly}
            className="rounded-full border border-white/20 px-4 py-2 text-sm text-zinc-300 hover:border-white/40 hover:text-white"
          >
            Nur Essenzielle
          </button>
          <button
            onClick={accept}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200"
          >
            Alle akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
