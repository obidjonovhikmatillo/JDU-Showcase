import "server-only";

import prisma from "@/lib/prisma";
import { parsePagination, type PaginationInput } from "@/lib/admin/pagination";

export async function getAdminDashboardStats() {
  const [
    totalRestaurants,
    publishedRestaurants,
    totalUsers,
    totalReviews,
    ratingAggregate,
    recentUsers,
    recentReviews,
    mostReviewedRestaurants,
  ] = await Promise.all([
    prisma.restaurant.count(),
    prisma.restaurant.count({ where: { isPublished: true } }),
    prisma.user.count(),
    prisma.review.count(),
    prisma.review.aggregate({ _avg: { rating: true } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        rating: true,
        createdAt: true,
        user: { select: { fullName: true } },
        restaurant: { select: { name: true, slug: true } },
      },
    }),
    prisma.restaurant.findMany({
      orderBy: { reviews: { _count: "desc" } },
      take: 5,
      select: {
        id: true,
        name: true,
        slug: true,
        isPublished: true,
        _count: { select: { reviews: true } },
      },
    }),
  ]);

  return {
    totalRestaurants,
    publishedRestaurants,
    totalUsers,
    totalReviews,
    averagePlatformRating: ratingAggregate._avg.rating,
    recentUsers,
    recentReviews,
    mostReviewedRestaurants,
  };
}

export type AdminRestaurantListFilters = PaginationInput & {
  q?: string;
  published?: "all" | "published" | "draft";
  categoryId?: string;
};

export async function listAdminRestaurantsPaginated(filters: AdminRestaurantListFilters) {
  const { page, pageSize, skip, totalPages } = parsePagination(filters);

  const where = {
    ...(filters.q
      ? {
          OR: [
            { name: { contains: filters.q, mode: "insensitive" as const } },
            { city: { contains: filters.q, mode: "insensitive" as const } },
            { slug: { contains: filters.q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(filters.published === "published" ? { isPublished: true } : {}),
    ...(filters.published === "draft" ? { isPublished: false } : {}),
    ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.restaurant.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        city: true,
        isPublished: true,
        mainImageUrl: true,
        category: { select: { id: true, nameEn: true, slug: true } },
        _count: { select: { images: true, reviews: true } },
      },
    }),
    prisma.restaurant.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: totalPages(total) };
}

export async function getAdminRestaurantForEdit(slug: string) {
  return prisma.restaurant.findUnique({
    where: { slug },
    include: {
      category: true,
      images: {
        orderBy: { createdAt: "asc" },
        select: { id: true, imageUrl: true, publicId: true },
      },
    },
  });
}

export async function listAdminCategoryOptions() {
  return prisma.category.findMany({
    orderBy: { nameEn: "asc" },
    select: { id: true, nameEn: true, nameUz: true, slug: true },
  });
}
