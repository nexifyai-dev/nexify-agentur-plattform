import de from "@/lib/i18n/de.json";
import en from "@/lib/i18n/en.json";
import nl from "@/lib/i18n/nl.json";

export const locales = ["de", "en", "nl"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "de";

const translations = { de, en, nl } as const;

export function getTranslations(locale: Locale) {
  return translations[locale] ?? translations[defaultLocale];
}

export type Translations = ReturnType<typeof getTranslations>;

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
