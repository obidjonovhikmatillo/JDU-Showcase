import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { RestaurantDiscovery } from "@/components/restaurants/restaurant-discovery";
import { RestaurantsErrorState } from "@/components/restaurants/restaurants-error-state";
import { getCategoryLabel } from "@/lib/categories";
import {
  discoverRestaurants,
  getDiscoveryFacets,
} from "@/lib/restaurants/discovery";
import {
  discoveryFiltersKey,
  parseDiscoveryParams,
  type DiscoverySearchParams,
} from "@/lib/restaurants/discovery-params";

type RestaurantsPageProps = {
  searchParams: Promise<DiscoverySearchParams>;
};

function buildSubtitle(
  t: Awaited<ReturnType<typeof getTranslations>>,
  filters: ReturnType<typeof parseDiscoveryParams>,
  categoryName?: string,
) {
  const parts: string[] = [];

  if (filters.query) {
    parts.push(t("searchSubtitle", { query: filters.query }));
  }

  if (categoryName) {
    parts.push(t("filteredSubtitle", { category: categoryName }));
  }

  if (filters.city) {
    parts.push(t("citySubtitle", { city: filters.city }));
  }

  if (parts.length === 0) {
    return t("subtitle");
  }

  return parts.join(" ");
}

export async function generateMetadata({
  searchParams,
}: RestaurantsPageProps): Promise<Metadata> {
  const t = await getTranslations("Restaurants");
  const params = parseDiscoveryParams(await searchParams);

  if (params.query) {
    return { title: t("searchTitle", { query: params.query }) };
  }

  if (params.categorySlug) {
    return { title: t("filteredTitle") };
  }

  return { title: t("title") };
}

export default async function RestaurantsPage({ searchParams }: RestaurantsPageProps) {
  const t = await getTranslations("Restaurants");
  const locale = await getLocale();
  const filters = parseDiscoveryParams(await searchParams);

  let categories;
  let cities;
  let result;

  try {
    [{ categories, cities }, result] = await Promise.all([
      getDiscoveryFacets(),
      discoverRestaurants(filters),
    ]);
  } catch (error) {
    console.error("Restaurants page error:", error);
    return <RestaurantsErrorState />;
  }

  const activeCategory = filters.categorySlug
    ? categories.find((item) => item.slug === filters.categorySlug)
    : undefined;

  const subtitle = buildSubtitle(
    t,
    filters,
    activeCategory ? getCategoryLabel(activeCategory, locale) : undefined,
  );

  return (
    <RestaurantDiscovery
      key={discoveryFiltersKey(filters)}
      result={result}
      categories={categories}
      cities={cities}
      title={t("title")}
      subtitle={subtitle}
      filtersKey={discoveryFiltersKey(filters)}
    />
  );
}
