import "server-only";

import type { Language, Role } from "@prisma/client";

import { parsePagination, type PaginationInput } from "@/lib/admin/pagination";
import prisma from "@/lib/prisma";
import { serializeCommentForClient } from "@/lib/comments/comment-serialization";
import { normalizeImageSrcForDisplay } from "@/lib/uploads/uploaded-image-url";
import type { ProjectSummary } from "./project-types";
import { toSummary, publishedProjectInclude } from "./project-summary.server";

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
  totalComments: number;
  averageRatingGiven: number | null;
};

export type ProfileCommentRecord = ReturnType<typeof serializeCommentForClient> & {
  project: {
    id: string;
    title: string;
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
  const aggregate = await prisma.comment.aggregate({
    where: { userId },
    _count: { _all: true },
    _avg: { rating: true },
  });

  return {
    totalComments: aggregate._count._all,
    averageRatingGiven: aggregate._avg.rating,
  };
}

export async function listUserProfileComments(
  userId: string,
  pagination: PaginationInput = {},
) {
  const { page, pageSize, skip, totalPages } = parsePagination(pagination);

  const where = { userId };

  const [total, comments] = await Promise.all([
    prisma.comment.count({ where }),
    prisma.comment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
      select: {
        id: true,
        rating: true,
        title: true,
        content: true,
        createdAt: true,
        user: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
        project: {
          select: { id: true, title: true, slug: true },
        },
        images: {
          select: { id: true, imageUrl: true, publicId: true },
          orderBy: { createdAt: "asc" },
        },
      },
    }),
  ]);

  const items: ProfileCommentRecord[] = comments.map((comment) => ({
    ...serializeCommentForClient(comment),
    project: comment.project,
  }));

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: totalPages(total),
  };
}

/** Get all published projects authored by the given user. */
export async function getUserProjects(userId: string): Promise<ProjectSummary[]> {
  const projects = await prisma.project.findMany({
    where: { authorId: userId, isPublished: true },
    include: publishedProjectInclude,
    orderBy: { createdAt: "desc" },
  });

  return projects.map(toSummary);
}

/** Get all projects that the user has liked. */
export async function getUserLikedProjectSummaries(userId: string): Promise<ProjectSummary[]> {
  const likes = await prisma.projectLike.findMany({
    where: { userId },
    include: {
      project: {
        include: publishedProjectInclude,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return likes
    .filter((l) => l.project.isPublished)
    .map((l) => toSummary(l.project));
}

/** Get all projects that the user has saved. */
export async function getUserSavedProjectSummaries(userId: string): Promise<ProjectSummary[]> {
  const saves = await prisma.projectSave.findMany({
    where: { userId },
    include: {
      project: {
        include: publishedProjectInclude,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return saves
    .filter((s) => s.project.isPublished)
    .map((s) => toSummary(s.project));
}
