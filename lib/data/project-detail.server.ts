import "server-only";

import prisma from "@/lib/prisma";
import { getProjectDescription } from "@/lib/projects/localized";
import { computeAverageRating } from "@/lib/projects/compute-average-rating";

import type { ProjectDetailRecord, CommentRecord } from "./comment-types";

function mapComment(comment: {
  id: string;
  rating: number;
  title: string;
  content: string;
  createdAt: Date;
  user: { id: string; fullName: string; avatarUrl: string | null };
  images: { id: string; imageUrl: string; publicId: string | null }[];
}): CommentRecord {
  return {
    id: comment.id,
    rating: comment.rating,
    title: comment.title,
    content: comment.content,
    createdAt: comment.createdAt,
    user: comment.user,
    images: comment.images,
  };
}

export async function getProjectDetailBySlug(
  slug: string,
  locale: string,
): Promise<ProjectDetailRecord | null> {
  const project = await prisma.project.findFirst({
    where: { slug, isPublished: true },
    include: {
      category: true,
      images: {
        orderBy: { createdAt: "asc" },
      },
      comments: {
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
            },
          },
          images: {
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });

  if (!project) {
    return null;
  }

  const comments = project.comments.map(mapComment);

  return {
    id: project.id,
    title: project.title,
    slug: project.slug,
    description: getProjectDescription(project, locale),
    authorName: project.authorName,
    department: project.department,
    demoUrl: project.demoUrl,
    githubUrl: project.githubUrl,
    mainImageUrl: project.mainImageUrl,
    mainImagePublicId: project.mainImagePublicId,
    galleryImages: project.images,
    techStack: project.techStack,
    difficulty: project.difficulty,
    category: project.category,
    averageRating: computeAverageRating(comments),
    commentCount: comments.length,
    comments,
  };
}

export async function getProjectAverageRating(
  projectId: string,
): Promise<{ averageRating: number | null; commentCount: number }> {
  const comments = await prisma.comment.findMany({
    where: { projectId },
    select: { rating: true },
  });

  return {
    averageRating: computeAverageRating(comments),
    commentCount: comments.length,
  };
}
