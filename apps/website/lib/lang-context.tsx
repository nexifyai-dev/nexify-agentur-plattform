"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "de" | "en" | "nl";

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "de", setLang: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("de");

  useEffect(() => {
    const stored = window.localStorage.getItem("nexify-lang");
    if (stored === "nl" || stored === "de" || stored === "en") {
      setLangState(stored);
      document.documentElement.lang = stored;
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("nexify-lang", l);
    document.documentElement.lang = l;
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);
