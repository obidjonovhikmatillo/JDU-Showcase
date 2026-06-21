import "server-only";

import prisma from "@/lib/prisma";
import {
  discoverRestaurants,
  type DiscoveryFilters,
} from "@/lib/restaurants/discovery";

import {
  publishedRestaurantInclude,
  toSummary,
} from "./restaurant-summary.server";
import type { CategoryWithCount, RestaurantSummary } from "./restaurant-types";

export type { RestaurantSummary, CategoryWithCount } from "./restaurant-types";
export { toSummary, publishedRestaurantInclude } from "./restaurant-summary.server";

export async function getPublishedRestaurants(): Promise<RestaurantSummary[]> {
  const restaurants = await prisma.restaurant.findMany({
    where: { isPublished: true },
    include: publishedRestaurantInclude,
    orderBy: { name: "asc" },
  });

  return restaurants.map(toSummary);
}

export async function getCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          restaurants: {
            where: { isPublished: true },
          },
        },
      },
    },
    orderBy: { nameEn: "asc" },
  });

  return categories.map((category) => ({
    ...category,
    restaurantCount: category._count.restaurants,
  }));
}

export async function getTopRatedRestaurants(limit = 8): Promise<RestaurantSummary[]> {
  const restaurants = await getPublishedRestaurants();

  return restaurants
    .filter((restaurant) => restaurant.reviewCount > 0)
    .sort((a, b) => {
      const ratingDiff = (b.averageRating ?? 0) - (a.averageRating ?? 0);
      if (ratingDiff !== 0) {
        return ratingDiff;
      }

      return b.reviewCount - a.reviewCount;
    })
    .slice(0, limit);
}

export async function getRecentRestaurants(limit = 8): Promise<RestaurantSummary[]> {
  const restaurants = await prisma.restaurant.findMany({
    where: { isPublished: true },
    include: publishedRestaurantInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return restaurants.map(toSummary);
}

export type RestaurantListFilters = {
  categorySlug?: string;
  query?: string;
};

export async function getFilteredRestaurants(
  filters: RestaurantListFilters = {},
): Promise<RestaurantSummary[]> {
  const result = await discoverRestaurants({
    query: filters.query,
    categorySlug: filters.categorySlug,
    sort: "name",
    page: 50,
    view: "grid",
  });

  return result.items.slice(0, result.total);
}

export async function getHomePageData() {
  const [categories, topRated, recent] = await Promise.all([
    getCategoriesWithCounts(),
    getTopRatedRestaurants(),
    getRecentRestaurants(),
  ]);

  return { categories, topRated, recent };
}

export type { DiscoveryFilters };
