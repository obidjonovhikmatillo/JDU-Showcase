import "server-only";

import prisma from "@/lib/prisma";
import { parsePagination, type PaginationInput } from "@/lib/admin/pagination";

export type AdminUserListFilters = PaginationInput & {
  q?: string;
  role?: "USER" | "ADMIN";
  active?: "all" | "active" | "inactive";
};

export async function listAdminUsersPaginated(filters: AdminUserListFilters) {
  const { page, pageSize, skip, totalPages } = parsePagination(filters);

  const where = {
    ...(filters.q
      ? {
          OR: [
            { fullName: { contains: filters.q, mode: "insensitive" as const } },
            { email: { contains: filters.q, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(filters.role ? { role: filters.role } : {}),
    ...(filters.active === "active" ? { isActive: true } : {}),
    ...(filters.active === "inactive" ? { isActive: false } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
        preferredLanguage: true,
        createdAt: true,
        _count: { select: { comments: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { items, total, page, pageSize, totalPages: totalPages(total) };
}
