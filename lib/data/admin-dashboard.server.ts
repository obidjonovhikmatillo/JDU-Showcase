import "server-only";

import prisma from "@/lib/prisma";
import { parsePagination, type PaginationInput } from "@/lib/admin/pagination";

export async function getAdminDashboardStats() {
  const [
    totalProjects,
    publishedProjects,
    totalUsers,
    totalComments,
    ratingAggregate,
    recentUsers,
    recentComments,
    mostCommentedProjects,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { isPublished: true } }),
    prisma.user.count(),
    prisma.comment.count(),
    prisma.comment.aggregate({ _avg: { rating: true } }),
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
    prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        rating: true,
        createdAt: true,
        user: { select: { fullName: true } },
        project: { select: { title: true, slug: true } },
      },
    }),
    prisma.project.findMany({
      orderBy: { comments: { _count: "desc" } },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        isPublished: true,
        _count: { select: { comments: true } },
      },
    }),
  ]);

  return {
    totalProjects,
    publishedProjects,
    totalUsers,
    totalComments,
    averagePlatformRating: ratingAggregate._avg.rating,
    recentUsers,
    recentComments,
    mostCommentedProjects,
  };
}

export type AdminProjectListFilters = PaginationInput & {
  q?: string;
  published?: "all" | "published" | "draft";
  categoryId?: string;
};

export async function listAdminProjectsPaginated(filters: AdminProjectListFilters) {
  const { page, pageSize, skip, totalPages } = parsePagination(filters);

  const where = {
    ...(filters.q
      ? {
          OR: [
            { title: { contains: filters.q, mode: "insensitive" as const } },
            { department: { contains: filters.q, mode: "insensitive" as const } },
            { slug: { contains: filters.q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(filters.published === "published" ? { isPublished: true } : {}),
    ...(filters.published === "draft" ? { isPublished: false } : {}),
    ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.project.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        department: true,
        isPublished: true,
        mainImageUrl: true,
        category: { select: { id: true, nameEn: true, slug: true } },
        _count: { select: { images: true, comments: true } },
      },
    }),
    prisma.project.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: totalPages(total) };
}

export async function getAdminProjectForEdit(slug: string) {
  return prisma.project.findUnique({
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
