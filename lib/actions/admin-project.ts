"use server";

import { getTranslations } from "next-intl/server";

import { revalidateAdminPaths } from "@/lib/admin/revalidate-admin-paths";
import { requireAdminAction } from "@/lib/admin/require-admin-action";
import { revalidateProjectPaths } from "@/lib/admin/revalidate-admin-paths";
import prisma from "@/lib/prisma";
import { deleteUploadedImages } from "@/lib/uploads/image-storage.server";
import {
  createAdminProjectDeleteSchema,
  createAdminProjectPublishSchema,
  createAdminProjectSchema,
  createAdminProjectUpdateSchema,
} from "@/lib/validations/admin-project-schema";

export type AdminProjectActionState = {
  success?: boolean;
  error?: string;
  forbidden?: boolean;
  fieldErrors?: Record<string, string[]>;
  slug?: string;
};

function parseProjectFormData(formData: FormData) {
  return {
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    authorName: formData.get("authorName"),
    department: formData.get("department"),
    demoUrl: formData.get("demoUrl"),
    githubUrl: formData.get("githubUrl"),
    techStack: formData.get("techStack"),
    difficulty: formData.get("difficulty"),
    categoryId: formData.get("categoryId"),
    isPublished: formData.get("isPublished") === "true" || formData.get("isPublished") === "on",
  };
}

function normalizeOptionalStrings<T extends Record<string, unknown>>(data: T) {
  const result = { ...data } as Record<string, unknown>;

  for (const key of ["demoUrl", "githubUrl", "techStack", "difficulty"] as const) {
    if (typeof result[key] === "string" && (result[key] as string).trim() === "") {
      result[key] = undefined;
    }
  }

  return result;
}

export async function createProject(
  _prev: AdminProjectActionState,
  formData: FormData,
): Promise<AdminProjectActionState> {
  const authResult = await requireAdminAction();
  const tValidation = await getTranslations("Validation");

  if (!authResult.ok) {
    return { forbidden: true, error: authResult.error };
  }

  const schema = createAdminProjectSchema((key) => tValidation(key));
  const parsed = schema.safeParse(normalizeOptionalStrings(parseProjectFormData(formData)));

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const slugExists = await prisma.project.findUnique({
    where: { slug: parsed.data.slug },
    select: { id: true },
  });

  if (slugExists) {
    return { error: tValidation("projectSlugExists") };
  }

  const category = await prisma.category.findUnique({
    where: { id: parsed.data.categoryId },
    select: { id: true },
  });

  if (!category) {
    return { error: tValidation("categoryRequired") };
  }

  const project = await prisma.project.create({
    data: {
      ...parsed.data,
      demoUrl: parsed.data.demoUrl ?? null,
      githubUrl: parsed.data.githubUrl ?? null,
      techStack: parsed.data.techStack ?? null,
      difficulty: parsed.data.difficulty ?? null,
    },
    select: { slug: true },
  });

  await revalidateAdminPaths();
  await revalidateProjectPaths(project.slug);

  return { success: true, slug: project.slug };
}

export async function updateProject(
  _prev: AdminProjectActionState,
  formData: FormData,
): Promise<AdminProjectActionState> {
  const authResult = await requireAdminAction();
  const tValidation = await getTranslations("Validation");
  const tErrors = await getTranslations("Errors");

  if (!authResult.ok) {
    return { forbidden: true, error: authResult.error };
  }

  const raw = {
    projectId: formData.get("projectId"),
    ...normalizeOptionalStrings(parseProjectFormData(formData)),
  };

  const schema = createAdminProjectUpdateSchema((key) => tValidation(key));
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existing = await prisma.project.findUnique({
    where: { id: parsed.data.projectId },
    select: { id: true, slug: true },
  });

  if (!existing) {
    return { error: tErrors("projectNotFound") };
  }

  const slugConflict = await prisma.project.findFirst({
    where: {
      slug: parsed.data.slug,
      NOT: { id: parsed.data.projectId },
    },
    select: { id: true },
  });

  if (slugConflict) {
    return { error: tValidation("projectSlugExists") };
  }

  const project = await prisma.project.update({
    where: { id: parsed.data.projectId },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      descriptionUz: parsed.data.descriptionUz,
      descriptionEn: parsed.data.descriptionEn,
      descriptionRu: parsed.data.descriptionRu,
      descriptionJa: parsed.data.descriptionJa,
      authorName: parsed.data.authorName,
      department: parsed.data.department,
      demoUrl: parsed.data.demoUrl ?? null,
      githubUrl: parsed.data.githubUrl ?? null,
      techStack: parsed.data.techStack ?? null,
      difficulty: parsed.data.difficulty ?? null,
      categoryId: parsed.data.categoryId,
      isPublished: parsed.data.isPublished,
    },
    select: { slug: true },
  });

  await revalidateAdminPaths();
  await revalidateProjectPaths(project.slug);
  if (existing.slug !== project.slug) {
    await revalidateProjectPaths(existing.slug);
  }

  return { success: true, slug: project.slug };
}

export async function deleteProject(
  _prev: AdminProjectActionState,
  formData: FormData,
): Promise<AdminProjectActionState> {
  const authResult = await requireAdminAction();
  const tValidation = await getTranslations("Validation");
  const tErrors = await getTranslations("Errors");

  if (!authResult.ok) {
    return { forbidden: true, error: authResult.error };
  }

  const schema = createAdminProjectDeleteSchema((key) => tValidation(key));
  const parsed = schema.safeParse({ projectId: formData.get("projectId") });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const project = await prisma.project.findUnique({
    where: { id: parsed.data.projectId },
    select: {
      slug: true,
      mainImagePublicId: true,
      images: { select: { publicId: true } },
    },
  });

  if (!project) {
    return { error: tErrors("projectNotFound") };
  }

  const publicIds = [
    ...(project.mainImagePublicId ? [project.mainImagePublicId] : []),
    ...project.images
      .map((image) => image.publicId)
      .filter((publicId): publicId is string => Boolean(publicId)),
  ];

  await prisma.project.delete({ where: { id: parsed.data.projectId } });

  if (publicIds.length > 0) {
    await deleteUploadedImages(publicIds);
  }

  await revalidateAdminPaths();
  await revalidateProjectPaths(project.slug);

  return { success: true };
}

export async function toggleProjectPublished(
  formData: FormData,
): Promise<AdminProjectActionState> {
  const authResult = await requireAdminAction();
  const tValidation = await getTranslations("Validation");
  const tErrors = await getTranslations("Errors");

  if (!authResult.ok) {
    return { forbidden: true, error: authResult.error };
  }

  const schema = createAdminProjectPublishSchema((key) => tValidation(key));
  const parsed = schema.safeParse({
    projectId: formData.get("projectId"),
    isPublished: formData.get("isPublished"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const project = await prisma.project.update({
    where: { id: parsed.data.projectId },
    data: { isPublished: parsed.data.isPublished },
    select: { slug: true },
  }).catch(() => null);

  if (!project) {
    return { error: tErrors("projectNotFound") };
  }

  await revalidateAdminPaths();
  await revalidateProjectPaths(project.slug);

  return { success: true, slug: project.slug };
}
