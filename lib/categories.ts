import type { Category } from "@prisma/client";

import type { Locale } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n";

type CategoryLabelSource = Pick<
  Category,
  "nameEn" | "nameUz" | "nameRu" | "nameJa"
>;

const localeNameKey: Record<Locale, keyof CategoryLabelSource> = {
  en: "nameEn",
  uz: "nameUz",
  ru: "nameRu",
  ja: "nameJa",
};

export function getCategoryLabel(category: CategoryLabelSource, locale: string): string {
  if (!isLocale(locale)) {
    return category.nameEn;
  }

  return category[localeNameKey[locale]];
}

export const categoryIconSlugs = [
  "uzbek-cuisine",
  "japanese-cuisine",
  "korean-cuisine",
  "turkish-cuisine",
  "european-cuisine",
  "fast-food",
  "coffee-shop",
  "dessert",
] as const;

export type CategoryIconSlug = (typeof categoryIconSlugs)[number];

export function isCategoryIconSlug(slug: string): slug is CategoryIconSlug {
  return categoryIconSlugs.includes(slug as CategoryIconSlug);
}
