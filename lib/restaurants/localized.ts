import type { Locale } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n";

type LocalizedRestaurant = {
  descriptionUz: string;
  descriptionEn: string;
  descriptionRu: string;
  descriptionJa: string;
};

const descriptionKey: Record<
  Locale,
  keyof Pick<
    LocalizedRestaurant,
    "descriptionEn" | "descriptionUz" | "descriptionRu" | "descriptionJa"
  >
> = {
  en: "descriptionEn",
  uz: "descriptionUz",
  ru: "descriptionRu",
  ja: "descriptionJa",
};

export function getRestaurantDescription(
  restaurant: LocalizedRestaurant,
  locale: string,
): string {
  if (!isLocale(locale)) {
    return restaurant.descriptionEn;
  }

  return restaurant[descriptionKey[locale]];
}
