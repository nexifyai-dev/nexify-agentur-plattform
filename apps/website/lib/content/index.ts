"use client";

import { de, type Dict } from "./de";
import { en } from "./en";
import { nl } from "./nl";
import { useLang } from "@/lib/lang-context";

export type { Dict, Service } from "./de";

export function useContent(): Dict {
  const { lang } = useLang();
  return lang === "nl" ? nl : lang === "en" ? en : de;
}
