import "server-only";

import prisma from "@/lib/prisma";
import { parsePagination, type PaginationInput } from "@/lib/admin/pagination";

export type AdminCategoryListFilters = PaginationInput & {
  q?: string;
};

export async function listAdminCategoriesPaginated(filters: AdminCategoryListFilters) {
  const { page, pageSize, skip, totalPages } = parsePagination(filters);

  const where = filters.q
    ? {
        OR: [
          { slug: { contains: filters.q, mode: "insensitive" as const } },
          { nameEn: { contains: filters.q, mode: "insensitive" as const } },
          { nameUz: { contains: filters.q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [items, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { nameEn: "asc" },
      select: {
        id: true,
        slug: true,
        nameUz: true,
        nameEn: true,
        nameRu: true,
        nameJa: true,
        _count: { select: { restaurants: true } },
      },
    }),
    prisma.category.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: totalPages(total) };
}

export async function getAdminCategoryById(categoryId: string) {
  return prisma.category.findUnique({ where: { id: categoryId } });
}
