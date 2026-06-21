import type { Locale } from "@/lib/i18n";

const PRICE_LEVEL_UZS: Record<
  number,
  { min: number; max: number; avg: number }
> = {
  1: { min: 50_000, max: 80_000, avg: 65_000 },
  2: { min: 80_000, max: 150_000, avg: 120_000 },
  3: { min: 150_000, max: 250_000, avg: 200_000 },
  4: { min: 250_000, max: 500_000, avg: 350_000 },
};

function localeTag(locale: Locale | string): string {
  switch (locale) {
    case "uz":
      return "uz-UZ";
    case "ru":
      return "ru-RU";
    case "ja":
      return "ja-JP";
    default:
      return "en-US";
  }
}

export function formatUzsAmount(amount: number, locale: Locale | string): string {
  const formatted = new Intl.NumberFormat(localeTag(locale), {
    maximumFractionDigits: 0,
  }).format(amount);

  if (locale === "uz" || locale === "ru") {
    return `${formatted} so'm`;
  }

  if (locale === "ja") {
    return `${formatted} UZS`;
  }

  return `${formatted} UZS`;
}

export function formatAverageSpend(
  priceLevel: number | null,
  locale: Locale | string,
): string | null {
  if (!priceLevel || !PRICE_LEVEL_UZS[priceLevel]) {
    return null;
  }

  return formatUzsAmount(PRICE_LEVEL_UZS[priceLevel].avg, locale);
}

export function formatPriceRange(
  priceLevel: number | null,
  locale: Locale | string,
): string | null {
  if (!priceLevel || !PRICE_LEVEL_UZS[priceLevel]) {
    return null;
  }

  const { min, max } = PRICE_LEVEL_UZS[priceLevel];
  return `${formatUzsAmount(min, locale)} – ${formatUzsAmount(max, locale)}`;
}

export function getPriceLevelLabel(priceLevel: number): string {
  return String(PRICE_LEVEL_UZS[priceLevel]?.avg ?? "");
}

export function isGuestFavorite(
  averageRating: number | null,
  reviewCount: number,
): boolean {
  return averageRating !== null && averageRating >= 4.7 && reviewCount >= 3;
}

export function computeRatingDistribution(ratings: number[]): number[] {
  const distribution = [0, 0, 0, 0, 0];

  for (const rating of ratings) {
    if (rating >= 1 && rating <= 5) {
      distribution[rating - 1] += 1;
    }
  }

  return distribution;
}
