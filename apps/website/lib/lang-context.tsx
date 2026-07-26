"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "de" | "en" | "nl";

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "de", setLang: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("de");

  useEffect(() => {
    const stored = window.localStorage.getItem("nexify-lang");
    const cookieMatch = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=(de|en|nl)/);
    const fromCookie = cookieMatch?.[1] as Lang | undefined;
    const initial =
      stored === "nl" || stored === "de" || stored === "en"
        ? stored
        : fromCookie === "nl" || fromCookie === "de" || fromCookie === "en"
          ? fromCookie
          : null;
    if (initial) {
      const timeoutId = window.setTimeout(() => {
        setLangState(initial);
        document.documentElement.lang = initial;
      }, 0);
      return () => window.clearTimeout(timeoutId);
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("nexify-lang", l);
    document.documentElement.lang = l;
    document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
