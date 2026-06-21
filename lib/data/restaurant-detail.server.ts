import "server-only";

import prisma from "@/lib/prisma";
import { getRestaurantDescription } from "@/lib/restaurants/localized";
import { computeAverageRating } from "@/lib/restaurants/compute-average-rating";

import type { RestaurantDetailRecord, ReviewRecord } from "./review-types";

function mapReview(review: {
  id: string;
  rating: number;
  title: string;
  content: string;
  visitDate: Date | null;
  createdAt: Date;
  user: { id: string; fullName: string; avatarUrl: string | null };
  images: { id: string; imageUrl: string; publicId: string | null }[];
}): ReviewRecord {
  return {
    id: review.id,
    rating: review.rating,
    title: review.title,
    content: review.content,
    visitDate: review.visitDate,
    createdAt: review.createdAt,
    user: review.user,
    images: review.images,
  };
}

export async function getRestaurantDetailBySlug(
  slug: string,
  locale: string,
): Promise<RestaurantDetailRecord | null> {
  const restaurant = await prisma.restaurant.findFirst({
    where: { slug, isPublished: true },
    include: {
      category: true,
      images: {
        orderBy: { createdAt: "asc" },
      },
      reviews: {
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
            },
          },
          images: {
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });

  if (!restaurant) {
    return null;
  }

  const reviews = restaurant.reviews.map(mapReview);

  return {
    id: restaurant.id,
    name: restaurant.name,
    slug: restaurant.slug,
    description: getRestaurantDescription(restaurant, locale),
    address: restaurant.address,
    city: restaurant.city,
    phone: restaurant.phone,
    website: restaurant.website,
    openingHours: restaurant.openingHours,
    mainImageUrl: restaurant.mainImageUrl,
    mainImagePublicId: restaurant.mainImagePublicId,
    galleryImages: restaurant.images,
    priceLevel: restaurant.priceLevel,
    cuisineType: restaurant.cuisineType,
    category: restaurant.category,
    averageRating: computeAverageRating(reviews),
    reviewCount: reviews.length,
    reviews,
  };
}

export async function getRestaurantAverageRating(
  restaurantId: string,
): Promise<{ averageRating: number | null; reviewCount: number }> {
  const reviews = await prisma.review.findMany({
    where: { restaurantId },
    select: { rating: true },
  });

  return {
    averageRating: computeAverageRating(reviews),
    reviewCount: reviews.length,
  };
}
