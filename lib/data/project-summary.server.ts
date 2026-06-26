import "server-only";

import type { Category, Project } from "@prisma/client";

import type { ProjectSummary } from "./project-types";

type CommentRating = { rating: number };

export type ProjectWithRelations = Project & {
  category: Category;
  comments: CommentRating[];
};

export const publishedProjectInclude = {
  category: true,
  comments: {
    select: { rating: true },
  },
} as const;

export function toSummary(project: ProjectWithRelations): ProjectSummary {
  const commentCount = project.comments.length;
  const averageRating =
    commentCount > 0
      ? project.comments.reduce((sum, comment) => sum + comment.rating, 0) / commentCount
      : null;

  return {
    id: project.id,
    title: project.title,
    slug: project.slug,
    mainImageUrl: project.mainImageUrl,
    authorName: project.authorName,
    department: project.department,
    techStack: project.techStack,
    category: project.category,
    averageRating,
    commentCount,
    createdAt: project.createdAt,
  };
}
