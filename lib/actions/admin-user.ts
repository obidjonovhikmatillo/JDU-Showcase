"use server";

import { getTranslations } from "next-intl/server";

import { requireAdminAction } from "@/lib/admin/require-admin-action";
import { canChangeUserRole, canDeactivateUser } from "@/lib/admin/access";
import { revalidateAdminPaths } from "@/lib/admin/revalidate-admin-paths";
import prisma from "@/lib/prisma";
import {
  createAdminUserRoleSchema,
  createAdminUserStatusSchema,
} from "@/lib/validations/admin-user-schema";

export type AdminUserActionState = {
  success?: boolean;
  error?: string;
  forbidden?: boolean;
  fieldErrors?: Record<string, string[]>;
};

export async function updateUserActiveStatus(
  formData: FormData,
): Promise<AdminUserActionState> {
  const authResult = await requireAdminAction();
  const tValidation = await getTranslations("Validation");
  const tErrors = await getTranslations("Errors");

  if (!authResult.ok) {
    return { forbidden: true, error: authResult.error };
  }

  const schema = createAdminUserStatusSchema((key) => tValidation(key));
  const parsed = schema.safeParse({
    userId: formData.get("userId"),
    isActive: formData.get("isActive"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  if (!canDeactivateUser(authResult.userId, parsed.data.userId, parsed.data.isActive)) {
    return { error: tErrors("cannotDeactivateSelf") };
  }

  const user = await prisma.user.update({
    where: { id: parsed.data.userId },
    data: { isActive: parsed.data.isActive },
    select: { id: true },
  }).catch(() => null);

  if (!user) {
    return { error: tErrors("userNotFound") };
  }

  await revalidateAdminPaths();
  return { success: true };
}

export async function updateUserRole(formData: FormData): Promise<AdminUserActionState> {
  const authResult = await requireAdminAction();
  const tValidation = await getTranslations("Validation");
  const tErrors = await getTranslations("Errors");

  if (!authResult.ok) {
    return { forbidden: true, error: authResult.error };
  }

  const schema = createAdminUserRoleSchema((key) => tValidation(key));
  const parsed = schema.safeParse({
    userId: formData.get("userId"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  if (!canChangeUserRole(authResult.userId, parsed.data.userId, parsed.data.role)) {
    return { error: tErrors("cannotDemoteSelf") };
  }

  const user = await prisma.user.update({
    where: { id: parsed.data.userId },
    data: { role: parsed.data.role },
    select: { id: true },
  }).catch(() => null);

  if (!user) {
    return { error: tErrors("userNotFound") };
  }

  await revalidateAdminPaths();
  return { success: true };
}
