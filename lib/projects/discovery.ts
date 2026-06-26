import "server-only";

import type { Prisma } from "@prisma/client";

import {
  publishedProjectInclude,
  toSummary,
} from "@/lib/data/project-summary.server";
import type { ProjectSummary } from "@/lib/data/project-types";
import prisma from "@/lib/prisma";

import {
  PROJECT_PAGE_SIZE,
  type DiscoveryFilters,
  type SortOption,
} from "./discovery-params";
import type { DiscoveryResult } from "./discovery-types";

export { PROJECT_PAGE_SIZE } from "./discovery-params";
export type {
  DiscoveryFilters,
  DiscoverySearchParams,
  SortOption,
  ViewMode,
} from "./discovery-params";
export type { DiscoveryResult } from "./discovery-types";
export {
  parseDiscoveryParams,
  parseSort,
  parseViewMode,
  buildDiscoveryQuery,
  discoveryFiltersKey,
} from "./discovery-params";

function buildWhereClause(filters: DiscoveryFilters): Prisma.ProjectWhereInput {
  const where: Prisma.ProjectWhereInput = {
    isPublished: true,
  };

  if (filters.categorySlug) {
    where.category = { slug: filters.categorySlug };
  }

  if (filters.department) {
    where.department = { equals: filters.department, mode: "insensitive" };
  }

  if (filters.query) {
    where.OR = [
      { title: { contains: filters.query, mode: "insensitive" } },
      { authorName: { contains: filters.query, mode: "insensitive" } },
      { department: { contains: filters.query, mode: "insensitive" } },
      { techStack: { contains: filters.query, mode: "insensitive" } },
      { descriptionUz: { contains: filters.query, mode: "insensitive" } },
      { descriptionEn: { contains: filters.query, mode: "insensitive" } },
      { descriptionRu: { contains: filters.query, mode: "insensitive" } },
      { descriptionJa: { contains: filters.query, mode: "insensitive" } },
    ];
  }

  return where;
}

function sortProjects(
  projects: ProjectSummary[],
  sort: SortOption,
): ProjectSummary[] {
  const sorted = [...projects];

  switch (sort) {
    case "comments":
      return sorted.sort((a, b) => {
        const countDiff = b.commentCount - a.commentCount;
        if (countDiff !== 0) return countDiff;
        return (b.averageRating ?? 0) - (a.averageRating ?? 0);
      });
    case "newest":
      return sorted.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );
    case "title":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "rating":
    default:
      return sorted.sort((a, b) => {
        const ratingDiff = (b.averageRating ?? 0) - (a.averageRating ?? 0);
        if (ratingDiff !== 0) return ratingDiff;
        return b.commentCount - a.commentCount;
      });
  }
}

export async function discoverProjects(
  filters: DiscoveryFilters,
): Promise<DiscoveryResult> {
  const projects = await prisma.project.findMany({
    where: buildWhereClause(filters),
    include: publishedProjectInclude,
  });

  let summaries = projects.map(toSummary);

  if (filters.minRating) {
    summaries = summaries.filter(
      (project) => (project.averageRating ?? 0) >= filters.minRating!,
    );
  }

  const sorted = sortProjects(summaries, filters.sort);
  const total = sorted.length;
  const take = filters.page * PROJECT_PAGE_SIZE;
  const items = sorted.slice(0, take);

  return {
    items,
    total,
    page: filters.page,
    pageSize: PROJECT_PAGE_SIZE,
    hasMore: total > take,
    filters,
  };
}

export async function getDistinctDepartments(): Promise<string[]> {
  const rows = await prisma.project.findMany({
    where: { isPublished: true },
    select: { department: true },
    distinct: ["department"],
    orderBy: { department: "asc" },
  });

  return rows.map((row) => row.department);
}

export async function getDiscoveryFacets() {
  const [categories, departments] = await Promise.all([
    prisma.category.findMany({
      include: {
        _count: {
          select: {
            projects: { where: { isPublished: true } },
          },
        },
      },
      orderBy: { nameEn: "asc" },
    }),
    getDistinctDepartments(),
  ]);

  return {
    categories: categories.map((category) => ({
      ...category,
      projectCount: category._count.projects,
    })),
    departments,
  };
}
