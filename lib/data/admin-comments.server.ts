import "server-only";

import prisma from "@/lib/prisma";
import { parsePagination, type PaginationInput } from "@/lib/admin/pagination";

export type AdminCommentListFilters = PaginationInput & {
  q?: string;
  projectId?: string;
  rating?: number;
};

export async function listAdminCommentsPaginated(filters: AdminCommentListFilters) {
  const { page, pageSize, skip, totalPages } = parsePagination(filters);

  const where = {
    ...(filters.q
      ? {
          OR: [
            { title: { contains: filters.q, mode: "insensitive" as const } },
            { content: { contains: filters.q, mode: "insensitive" as const } },
            { user: { fullName: { contains: filters.q, mode: "insensitive" as const } } },
            { project: { title: { contains: filters.q, mode: "insensitive" as const } } },
          ],
        }
      : {}),
    ...(filters.projectId ? { projectId: filters.projectId } : {}),
    ...(filters.rating ? { rating: filters.rating } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        rating: true,
        content: true,
        createdAt: true,
        user: { select: { id: true, fullName: true, email: true, avatarUrl: true } },
        project: { select: { id: true, title: true, slug: true } },
        _count: { select: { images: true } },
      },
    }),
    prisma.comment.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: totalPages(total) };
}

export async function listAdminCommentProjectOptions() {
  return prisma.project.findMany({
    orderBy: { title: "asc" },
    select: { id: true, title: true, slug: true },
  });
}

export async function getAdminCommentById(commentId: string) {
  return prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      user: { select: { id: true, fullName: true } },
      project: { select: { id: true, title: true, slug: true } },
      images: { select: { id: true, imageUrl: true, publicId: true } },
    },
  });
}
