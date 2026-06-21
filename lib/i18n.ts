import type { Language } from "@prisma/client";

import { routing } from "@/i18n/routing";

export const locales = routing.locales;
export type Locale = (typeof locales)[number];
export const defaultLocale = routing.defaultLocale;

export const localeLabels: Record<Locale, string> = {
  en: "English",
  uz: "O'zbek",
  ru: "Русский",
  ja: "日本語",
};

export const localeCodes: Record<Locale, string> = {
  en: "EN",
  uz: "UZ",
  ru: "RU",
  ja: "JA",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export const localeToLanguage: Record<Locale, Language> = {
  en: "EN",
  uz: "UZ",
  ru: "RU",
  ja: "JA",
};

export const languageToLocale: Record<Language, Locale> = {
  EN: "en",
  UZ: "uz",
  RU: "ru",
  JA: "ja",
};

export function stripLocaleFromPathname(pathname: string): string {
  const match = pathname.match(/^\/(en|uz|ru|ja)(\/.*)?$/);
  if (!match) {
    return pathname;
  }

  return match[2] || "/";
}

export function getLocaleFromPathname(pathname: string): Locale {
  const match = pathname.match(/^\/(en|uz|ru|ja)(\/|$)/);
  return (match?.[1] as Locale | undefined) ?? defaultLocale;
}
