import "server-only";

import prisma from "@/lib/prisma";
import {
  discoverProjects,
  type DiscoveryFilters,
} from "@/lib/projects/discovery";

import {
  publishedProjectInclude,
  toSummary,
} from "./project-summary.server";
import type { CategoryWithCount, ProjectSummary } from "./project-types";

export type { ProjectSummary, CategoryWithCount } from "./project-types";
export { toSummary, publishedProjectInclude } from "./project-summary.server";

export async function getPublishedProjects(): Promise<ProjectSummary[]> {
  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    include: publishedProjectInclude,
    orderBy: { title: "asc" },
  });

  return projects.map(toSummary);
}

export async function getCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          projects: {
            where: { isPublished: true },
          },
        },
      },
    },
    orderBy: { nameEn: "asc" },
  });

  return categories.map((category) => ({
    ...category,
    projectCount: category._count.projects,
  }));
}

export async function getTopRatedProjects(limit = 8): Promise<ProjectSummary[]> {
  const projects = await getPublishedProjects();

  return projects
    .filter((project) => project.commentCount > 0)
    .sort((a, b) => {
      const ratingDiff = (b.averageRating ?? 0) - (a.averageRating ?? 0);
      if (ratingDiff !== 0) {
        return ratingDiff;
      }

      return b.commentCount - a.commentCount;
    })
    .slice(0, limit);
}

export async function getRecentProjects(limit = 8): Promise<ProjectSummary[]> {
  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    include: publishedProjectInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return projects.map(toSummary);
}

export type ProjectListFilters = {
  categorySlug?: string;
  query?: string;
};

export async function getFilteredProjects(
  filters: ProjectListFilters = {},
): Promise<ProjectSummary[]> {
  const result = await discoverProjects({
    query: filters.query,
    categorySlug: filters.categorySlug,
    sort: "title",
    page: 50,
    view: "grid",
  });

  return result.items.slice(0, result.total);
}

export async function getHomePageData() {
  const [categories, topRated, recent] = await Promise.all([
    getCategoriesWithCounts(),
    getTopRatedProjects(),
    getRecentProjects(),
  ]);

  return { categories, topRated, recent };
}

export type { DiscoveryFilters };
