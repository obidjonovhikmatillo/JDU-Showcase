import "server-only";

import type { Prisma } from "@prisma/client";

import {
  publishedRestaurantInclude,
  toSummary,
} from "@/lib/data/restaurant-summary.server";
import type { RestaurantSummary } from "@/lib/data/restaurant-types";
import prisma from "@/lib/prisma";

import {
  RESTAURANT_PAGE_SIZE,
  type DiscoveryFilters,
  type SortOption,
} from "./discovery-params";
import type { DiscoveryResult } from "./discovery-types";

export { RESTAURANT_PAGE_SIZE } from "./discovery-params";
export type {
  DiscoveryFilters,
  DiscoverySearchParams,
  SortOption,
  ViewMode,
} from "./discovery-params";
export type { DiscoveryResult } from "./discovery-types";
export {
  parseDiscoveryParams,
  parseSort,
  parseViewMode,
  buildDiscoveryQuery,
  discoveryFiltersKey,
} from "./discovery-params";

function buildWhereClause(filters: DiscoveryFilters): Prisma.RestaurantWhereInput {
  const where: Prisma.RestaurantWhereInput = {
    isPublished: true,
  };

  if (filters.categorySlug) {
    where.category = { slug: filters.categorySlug };
  }

  if (filters.city) {
    where.city = { equals: filters.city, mode: "insensitive" };
  }

  if (filters.priceLevel) {
    where.priceLevel = filters.priceLevel;
  }

  if (filters.query) {
    where.OR = [
      { name: { contains: filters.query, mode: "insensitive" } },
      { address: { contains: filters.query, mode: "insensitive" } },
      { city: { contains: filters.query, mode: "insensitive" } },
      { cuisineType: { contains: filters.query, mode: "insensitive" } },
      { descriptionUz: { contains: filters.query, mode: "insensitive" } },
      { descriptionEn: { contains: filters.query, mode: "insensitive" } },
      { descriptionRu: { contains: filters.query, mode: "insensitive" } },
      { descriptionJa: { contains: filters.query, mode: "insensitive" } },
    ];
  }

  return where;
}

function sortRestaurants(
  restaurants: RestaurantSummary[],
  sort: SortOption,
): RestaurantSummary[] {
  const sorted = [...restaurants];

  switch (sort) {
    case "reviews":
      return sorted.sort((a, b) => {
        const countDiff = b.reviewCount - a.reviewCount;
        if (countDiff !== 0) return countDiff;
        return (b.averageRating ?? 0) - (a.averageRating ?? 0);
      });
    case "newest":
      return sorted.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "rating":
    default:
      return sorted.sort((a, b) => {
        const ratingDiff = (b.averageRating ?? 0) - (a.averageRating ?? 0);
        if (ratingDiff !== 0) return ratingDiff;
        return b.reviewCount - a.reviewCount;
      });
  }
}

export async function discoverRestaurants(
  filters: DiscoveryFilters,
): Promise<DiscoveryResult> {
  const restaurants = await prisma.restaurant.findMany({
    where: buildWhereClause(filters),
    include: publishedRestaurantInclude,
  });

  let summaries = restaurants.map(toSummary);

  if (filters.minRating) {
    summaries = summaries.filter(
      (restaurant) => (restaurant.averageRating ?? 0) >= filters.minRating!,
    );
  }

  const sorted = sortRestaurants(summaries, filters.sort);
  const total = sorted.length;
  const take = filters.page * RESTAURANT_PAGE_SIZE;
  const items = sorted.slice(0, take);

  return {
    items,
    total,
    page: filters.page,
    pageSize: RESTAURANT_PAGE_SIZE,
    hasMore: total > take,
    filters,
  };
}

export async function getDistinctCities(): Promise<string[]> {
  const rows = await prisma.restaurant.findMany({
    where: { isPublished: true },
    select: { city: true },
    distinct: ["city"],
    orderBy: { city: "asc" },
  });

  return rows.map((row) => row.city);
}

export async function getDiscoveryFacets() {
  const [categories, cities] = await Promise.all([
    prisma.category.findMany({
      include: {
        _count: {
          select: {
            restaurants: { where: { isPublished: true } },
          },
        },
      },
      orderBy: { nameEn: "asc" },
    }),
    getDistinctCities(),
  ]);

  return {
    categories: categories.map((category) => ({
      ...category,
      restaurantCount: category._count.restaurants,
    })),
    cities,
  };
}
