import "server-only";

import type { Language, Role } from "@prisma/client";

import { parsePagination, type PaginationInput } from "@/lib/admin/pagination";
import prisma from "@/lib/prisma";
import { serializeReviewForClient } from "@/lib/reviews/review-serialization";
import { normalizeImageSrcForDisplay } from "@/lib/uploads/uploaded-image-url";

export type ProfileUserRecord = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  preferredLanguage: Language;
  avatarUrl: string | null;
  profileHeadline: string | null;
  createdAt: Date;
};

export type ProfileStats = {
  totalReviews: number;
  averageRatingGiven: number | null;
};

export type ProfileReviewRecord = ReturnType<typeof serializeReviewForClient> & {
  restaurant: {
    id: string;
    name: string;
    slug: string;
  };
};

export async function getProfileUser(userId: string): Promise<ProfileUserRecord | null> {
  const baseSelect = {
    id: true,
    fullName: true,
    email: true,
    role: true,
    preferredLanguage: true,
    avatarUrl: true,
    createdAt: true,
  } as const;

  let user:
    | ({
        id: string;
        fullName: string;
        email: string;
        role: Role;
        preferredLanguage: Language;
        avatarUrl: string | null;
        createdAt: Date;
      } & { profileHeadline?: string | null })
    | null = null;

  try {
    user = await prisma.user.findUnique({
      where: { id: userId },
      select: { ...baseSelect, profileHeadline: true },
    });
  } catch {
    user = await prisma.user.findUnique({
      where: { id: userId },
      select: baseSelect,
    });
  }

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    preferredLanguage: user.preferredLanguage,
    avatarUrl: user.avatarUrl ? normalizeImageSrcForDisplay(user.avatarUrl) : null,
    profileHeadline: user.profileHeadline ?? null,
    createdAt: user.createdAt,
  };
}

export async function getProfileStats(userId: string): Promise<ProfileStats> {
  const aggregate = await prisma.review.aggregate({
    where: { userId },
    _count: { _all: true },
    _avg: { rating: true },
  });

  return {
    totalReviews: aggregate._count._all,
    averageRatingGiven: aggregate._avg.rating,
  };
}

export async function listUserProfileReviews(
  userId: string,
  pagination: PaginationInput = {},
) {
  const { page, pageSize, skip, totalPages } = parsePagination(pagination);

  const where = { userId };

  const [total, reviews] = await Promise.all([
    prisma.review.count({ where }),
    prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      select: {
        id: true,
        rating: true,
        title: true,
        content: true,
        visitDate: true,
        createdAt: true,
        user: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
        restaurant: {
          select: { id: true, name: true, slug: true },
        },
        images: {
          select: { id: true, imageUrl: true, publicId: true },
          orderBy: { createdAt: "asc" },
        },
      },
    }),
  ]);

  const items: ProfileReviewRecord[] = reviews.map((review) => ({
    ...serializeReviewForClient(review),
    restaurant: review.restaurant,
  }));

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: totalPages(total),
  };
}
