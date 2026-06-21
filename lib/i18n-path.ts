/** Locale path helpers without Prisma or other heavy server imports. */

export const pathLocales = ["en", "uz", "ru", "ja"] as const;
export type PathLocale = (typeof pathLocales)[number];
export const defaultPathLocale: PathLocale = "en";

export function isPathLocale(value: string): value is PathLocale {
  return pathLocales.includes(value as PathLocale);
}

export function stripLocaleFromPathname(pathname: string): string {
  const match = pathname.match(/^\/(en|uz|ru|ja)(\/.*)?$/);
  if (!match) {
    return pathname;
  }

  return match[2] || "/";
}

export function getLocaleFromPathname(pathname: string): PathLocale {
  const match = pathname.match(/^\/(en|uz|ru|ja)(\/|$)/);
  return (match?.[1] as PathLocale | undefined) ?? defaultPathLocale;
}
