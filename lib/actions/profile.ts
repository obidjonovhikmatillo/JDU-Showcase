"use server";

import { revalidatePath } from "next/cache";
import { getLocale, getTranslations } from "next-intl/server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { normalizeUploadedImageUrlForStorage } from "@/lib/uploads/uploaded-image-url";
import { createProfileUpdateSchema } from "@/lib/validations/create-auth-schemas";

export type ProfileUpdateActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  fullName?: string;
  profileHeadline?: string | null;
  preferredLanguage?: string;
  avatarUrl?: string | null;
};

export async function updateProfile(
  _prevState: ProfileUpdateActionState,
  formData: FormData,
): Promise<ProfileUpdateActionState> {
  const session = await auth();
  const tErrors = await getTranslations("Errors");
  const tValidation = await getTranslations("Validation");

  if (!session?.user?.id) {
    return { error: tErrors("mustBeSignedIn") };
  }

  const raw = {
    fullName: formData.get("fullName"),
    profileHeadline: formData.get("profileHeadline") ?? "",
    preferredLanguage: formData.get("preferredLanguage"),
    avatarUrl: formData.get("avatarUrl") ?? "",
  };

  const profileUpdateSchema = createProfileUpdateSchema((key) => tValidation(key));
  const parsed = profileUpdateSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const avatarUrl = normalizeUploadedImageUrlForStorage(parsed.data.avatarUrl);

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      fullName: parsed.data.fullName,
      preferredLanguage: parsed.data.preferredLanguage,
      avatarUrl,
      ...(parsed.data.profileHeadline?.trim()
        ? { profileHeadline: parsed.data.profileHeadline.trim() }
        : { profileHeadline: null }),
    },
    select: { id: true },
  }).catch(async () => {
    return prisma.user.update({
      where: { id: session.user.id },
      data: {
        fullName: parsed.data.fullName,
        preferredLanguage: parsed.data.preferredLanguage,
        avatarUrl,
      },
      select: { id: true },
    }).catch(() => null);
  });

  if (!user) {
    return { error: tErrors("userNotFound") };
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}`, "layout");
  revalidatePath(`/${locale}/profile`);

  return {
    success: true,
    fullName: parsed.data.fullName,
    profileHeadline: parsed.data.profileHeadline?.trim() || null,
    preferredLanguage: parsed.data.preferredLanguage,
    avatarUrl,
  };
}
