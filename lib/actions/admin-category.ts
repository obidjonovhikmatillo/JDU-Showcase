"use server";

import { getTranslations } from "next-intl/server";

import { revalidateAdminPaths } from "@/lib/admin/revalidate-admin-paths";
import { requireAdminAction } from "@/lib/admin/require-admin-action";
import { slugify } from "@/lib/admin/slugify";
import prisma from "@/lib/prisma";
import {
  createAdminCategoryDeleteSchema,
  createAdminCategorySchema,
  createAdminCategoryUpdateSchema,
} from "@/lib/validations/admin-category-schema";

export type AdminCategoryActionState = {
  success?: boolean;
  error?: string;
  forbidden?: boolean;
  fieldErrors?: Record<string, string[]>;
};

export async function createCategory(
  _prev: AdminCategoryActionState,
  formData: FormData,
): Promise<AdminCategoryActionState> {
  const authResult = await requireAdminAction();
  const tValidation = await getTranslations("Validation");

  if (!authResult.ok) {
    return { forbidden: true, error: authResult.error };
  }

  const raw = {
    nameUz: formData.get("nameUz"),
    nameEn: formData.get("nameEn"),
    nameRu: formData.get("nameRu"),
    nameJa: formData.get("nameJa"),
    slug: formData.get("slug") || slugify(String(formData.get("nameEn") ?? "")),
  };

  const schema = createAdminCategorySchema((key) => tValidation(key));
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existing = await prisma.category.findUnique({
    where: { slug: parsed.data.slug },
    select: { id: true },
  });

  if (existing) {
    return { error: tValidation("categorySlugExists") };
  }

  await prisma.category.create({ data: parsed.data });
  await revalidateAdminPaths();

  return { success: true };
}

export async function updateCategory(
  _prev: AdminCategoryActionState,
  formData: FormData,
): Promise<AdminCategoryActionState> {
  const authResult = await requireAdminAction();
  const tValidation = await getTranslations("Validation");
  const tErrors = await getTranslations("Errors");

  if (!authResult.ok) {
    return { forbidden: true, error: authResult.error };
  }

  const raw = {
    categoryId: formData.get("categoryId"),
    nameUz: formData.get("nameUz"),
    nameEn: formData.get("nameEn"),
    nameRu: formData.get("nameRu"),
    nameJa: formData.get("nameJa"),
    slug: formData.get("slug"),
  };

  const schema = createAdminCategoryUpdateSchema((key) => tValidation(key));
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const category = await prisma.category.findUnique({
    where: { id: parsed.data.categoryId },
    select: { id: true },
  });

  if (!category) {
    return { error: tErrors("categoryNotFound") };
  }

  const slugConflict = await prisma.category.findFirst({
    where: {
      slug: parsed.data.slug,
      NOT: { id: parsed.data.categoryId },
    },
    select: { id: true },
  });

  if (slugConflict) {
    return { error: tValidation("categorySlugExists") };
  }

  await prisma.category.update({
    where: { id: parsed.data.categoryId },
    data: {
      nameUz: parsed.data.nameUz,
      nameEn: parsed.data.nameEn,
      nameRu: parsed.data.nameRu,
      nameJa: parsed.data.nameJa,
      slug: parsed.data.slug,
    },
  });

  await revalidateAdminPaths();
  return { success: true };
}

export async function deleteCategory(
  _prev: AdminCategoryActionState,
  formData: FormData,
): Promise<AdminCategoryActionState> {
  const authResult = await requireAdminAction();
  const tValidation = await getTranslations("Validation");
  const tErrors = await getTranslations("Errors");

  if (!authResult.ok) {
    return { forbidden: true, error: authResult.error };
  }

  const schema = createAdminCategoryDeleteSchema((key) => tValidation(key));
  const parsed = schema.safeParse({ categoryId: formData.get("categoryId") });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const restaurantCount = await prisma.restaurant.count({
    where: { categoryId: parsed.data.categoryId },
  });

  if (restaurantCount > 0) {
    return { error: tErrors("categoryInUse") };
  }

  try {
    await prisma.category.delete({ where: { id: parsed.data.categoryId } });
  } catch {
    return { error: tErrors("categoryNotFound") };
  }

  await revalidateAdminPaths();
  return { success: true };
}
