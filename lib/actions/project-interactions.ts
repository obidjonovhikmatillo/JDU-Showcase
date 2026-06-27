"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function toggleLike(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "unauthorized" };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { error: "unauthorized" };

  const existing = await prisma.projectLike.findUnique({
    where: { userId_projectId: { userId: user.id, projectId } },
  });

  if (existing) {
    await prisma.projectLike.delete({ where: { id: existing.id } });
  } else {
    await prisma.projectLike.create({
      data: { userId: user.id, projectId },
    });
  }

  revalidatePath("/", "layout");
  return { success: true, liked: !existing };
}

export async function toggleSave(projectId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "unauthorized" };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { error: "unauthorized" };

  const existing = await prisma.projectSave.findUnique({
    where: { userId_projectId: { userId: user.id, projectId } },
  });

  if (existing) {
    await prisma.projectSave.delete({ where: { id: existing.id } });
  } else {
    await prisma.projectSave.create({
      data: { userId: user.id, projectId },
    });
  }

  revalidatePath("/", "layout");
  return { success: true, saved: !existing };
}

export async function getLikedProjectIds(userId: string): Promise<string[]> {
  const likes = await prisma.projectLike.findMany({
    where: { userId },
    select: { projectId: true },
  });
  return likes.map((l) => l.projectId);
}

export async function getSavedProjectIds(userId: string): Promise<string[]> {
  const saves = await prisma.projectSave.findMany({
    where: { userId },
    select: { projectId: true },
  });
  return saves.map((s) => s.projectId);
}

export async function getUserLikedProjects(userId: string) {
  return prisma.projectLike.findMany({
    where: { userId },
    include: {
      project: {
        include: {
          category: true,
          comments: { select: { rating: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserSavedProjects(userId: string) {
  return prisma.projectSave.findMany({
    where: { userId },
    include: {
      project: {
        include: {
          category: true,
          comments: { select: { rating: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
