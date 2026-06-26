"use server";

import prisma from "@/lib/prisma";
import { getProjectDescription } from "@/lib/projects/localized";
import { computeAverageRating } from "@/lib/projects/compute-average-rating";
import { serializeCommentForClient } from "@/lib/comments/comment-serialization";
import type { SerializedCommentRecord } from "@/lib/comments/comment-serialization";

export type ProjectModalData = {
  id: string;
  title: string;
  slug: string;
  description: string;
  authorName: string;
  department: string;
  demoUrl: string | null;
  githubUrl: string | null;
  mainImageUrl: string | null;
  galleryImages: { id: string; imageUrl: string; publicId: string | null }[];
  techStack: string | null;
  difficulty: string | null;
  category: {
    id: string;
    slug: string;
    nameUz: string;
    nameEn: string;
    nameRu: string;
    nameJa: string;
  };
  averageRating: number | null;
  commentCount: number;
  comments: SerializedCommentRecord[];
  moreByAuthor: {
    id: string;
    title: string;
    slug: string;
    mainImageUrl: string | null;
  }[];
};

export async function getProjectModalData(
  slug: string,
  locale: string
): Promise<ProjectModalData | null> {
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

  // Fetch more projects by the same author
  const moreByAuthor = await prisma.project.findMany({
    where: {
      authorName: project.authorName,
      isPublished: true,
      id: { not: project.id },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      mainImageUrl: true,
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const comments = project.comments.map((comment) => ({
    id: comment.id,
    rating: comment.rating,
    title: comment.title,
    content: comment.content,
    createdAt: comment.createdAt,
    user: comment.user,
    images: comment.images,
  }));

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
    galleryImages: project.images,
    techStack: project.techStack,
    difficulty: project.difficulty,
    category: project.category,
    averageRating: computeAverageRating(comments),
    commentCount: comments.length,
    comments: comments.map(serializeCommentForClient),
    moreByAuthor,
  };
}
