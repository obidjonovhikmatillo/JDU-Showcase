import "server-only";

import type { Category, Restaurant } from "@prisma/client";

import type { RestaurantSummary } from "./restaurant-types";

type ReviewRating = { rating: number };

export type RestaurantWithRelations = Restaurant & {
  category: Category;
  reviews: ReviewRating[];
};

export const publishedRestaurantInclude = {
  category: true,
  reviews: {
    select: { rating: true },
  },
} as const;

export function toSummary(restaurant: RestaurantWithRelations): RestaurantSummary {
  const reviewCount = restaurant.reviews.length;
  const averageRating =
    reviewCount > 0
      ? restaurant.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
      : null;

  return {
    id: restaurant.id,
    name: restaurant.name,
    slug: restaurant.slug,
    mainImageUrl: restaurant.mainImageUrl,
    address: restaurant.address,
    city: restaurant.city,
    cuisineType: restaurant.cuisineType,
    priceLevel: restaurant.priceLevel,
    category: restaurant.category,
    averageRating,
    reviewCount,
    createdAt: restaurant.createdAt,
  };
}
