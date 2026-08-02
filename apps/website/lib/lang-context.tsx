"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "de" | "en" | "nl";

/** Product default — never infer NL/EN from navigator.language for acquisition. */
export const DEFAULT_LANG: Lang = "de";

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: DEFAULT_LANG,
  setLang: () => {},
});

function isLang(value: string | null | undefined): value is Lang {
  return value === "de" || value === "en" || value === "nl";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    const stored = window.localStorage.getItem("nexify-lang");
    const cookieMatch = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=(de|en|nl)/);
    const fromCookie = cookieMatch?.[1];
    // Explicit user preference only — no Accept-Language / navigator.language
    const initial: Lang = isLang(stored) ? stored : isLang(fromCookie) ? fromCookie : DEFAULT_LANG;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronize persisted locale on initial mount
    setLangState(initial);
    document.documentElement.lang = initial;
    if (!isLang(stored)) {
      window.localStorage.setItem("nexify-lang", initial);
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
