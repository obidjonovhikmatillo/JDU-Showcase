import "server-only";

import prisma from "@/lib/prisma";
import { parsePagination, type PaginationInput } from "@/lib/admin/pagination";

export type AdminReviewListFilters = PaginationInput & {
  q?: string;
  restaurantId?: string;
  rating?: number;
};

export async function listAdminReviewsPaginated(filters: AdminReviewListFilters) {
  const { page, pageSize, skip, totalPages } = parsePagination(filters);

  const where = {
    ...(filters.q
      ? {
          OR: [
            { title: { contains: filters.q, mode: "insensitive" as const } },
            { content: { contains: filters.q, mode: "insensitive" as const } },
            { user: { fullName: { contains: filters.q, mode: "insensitive" as const } } },
            { restaurant: { name: { contains: filters.q, mode: "insensitive" as const } } },
          ],
        }
      : {}),
    ...(filters.restaurantId ? { restaurantId: filters.restaurantId } : {}),
    ...(filters.rating ? { rating: filters.rating } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.review.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        rating: true,
        content: true,
        visitDate: true,
        createdAt: true,
        user: { select: { id: true, fullName: true, email: true, avatarUrl: true } },
        restaurant: { select: { id: true, name: true, slug: true } },
        _count: { select: { images: true } },
      },
    }),
    prisma.review.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: totalPages(total) };
}

export async function listAdminReviewRestaurantOptions() {
  return prisma.restaurant.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });
}

export async function getAdminReviewById(reviewId: string) {
  return prisma.review.findUnique({
    where: { id: reviewId },
    include: {
      user: { select: { id: true, fullName: true } },
      restaurant: { select: { id: true, name: true, slug: true } },
      images: { select: { id: true, imageUrl: true, publicId: true } },
    },
  });
}
