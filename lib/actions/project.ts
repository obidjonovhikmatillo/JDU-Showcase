"use server";

import { revalidatePath } from "next/cache";
import { getLocale, getTranslations } from "next-intl/server";

import { auth } from "@/auth";
import {
  deleteUploadedImages,
  isManagedUploadPublicId,
  isManagedUploadUrl,
} from "@/lib/uploads/image-storage.server";
import prisma from "@/lib/prisma";
import {
  createGalleryImagesSchema,
  parsePersistedImagesJson,
  persistedImageSchema,
} from "@/lib/validations/uploaded-images-schema";

export type ProjectImagesActionState = {
  success?: boolean;
  error?: string;
  forbidden?: boolean;
  fieldErrors?: Record<string, string[]>;
};

function ensureAdmin(role: string | undefined) {
  return role === "ADMIN";
}

function validateGalleryImages(images: Array<{ url: string; publicId?: string }>) {
  return images.every((image) => {
    if (!image.publicId) {
      return true;
    }

    return (
      isManagedUploadUrl(image.url) &&
      isManagedUploadPublicId(image.publicId, "projectGallery")
    );
  });
}

function validateMainImageRecord(image: { url: string; publicId?: string } | null) {
  if (!image) {
    return true;
  }

  if (!image.publicId) {
    return true;
  }

  return (
    isManagedUploadUrl(image.url) &&
    isManagedUploadPublicId(image.publicId, "projectMain")
  );
}

export async function updateProjectImages(
  _prevState: ProjectImagesActionState,
  formData: FormData,
): Promise<ProjectImagesActionState> {
  const session = await auth();
  const tErrors = await getTranslations("Errors");
  const tValidation = await getTranslations("Validation");

  if (!session?.user?.id || !ensureAdmin(session.user.role)) {
    return { forbidden: true, error: tErrors("adminRequired") };
  }

  const projectSlug = formData.get("projectSlug");
  const mainImageRaw = formData.get("mainImage");
  const galleryRaw = formData.get("galleryImages") ?? "[]";

  if (typeof projectSlug !== "string" || !projectSlug.trim()) {
    return { error: tErrors("projectNotFound") };
  }

  let mainImage: { url: string; publicId?: string } | null = null;
  if (typeof mainImageRaw === "string" && mainImageRaw.trim()) {
    try {
      mainImage = persistedImageSchema.parse(JSON.parse(mainImageRaw));
    } catch {
      return { error: tValidation("mainImageInvalid") };
    }
  }

  let galleryImages: Array<{ url: string; publicId?: string }> = [];
  try {
    galleryImages = createGalleryImagesSchema((key) => tValidation(key)).parse(
      parsePersistedImagesJson(galleryRaw),
    );
  } catch {
    return { error: tValidation("galleryImagesInvalid") };
  }

  if (!validateMainImageRecord(mainImage) || !validateGalleryImages(galleryImages)) {
    return { error: tValidation("galleryImagesInvalid") };
  }

  const project = await prisma.project.findUnique({
    where: { slug: projectSlug },
    select: {
      id: true,
      slug: true,
      mainImagePublicId: true,
      images: {
        select: {
          id: true,
          publicId: true,
        },
      },
    },
  });

  if (!project) {
    return { error: tErrors("projectNotFound") };
  }

  const removedPublicIds: string[] = [];

  if (
    project.mainImagePublicId &&
    (!mainImage || project.mainImagePublicId !== mainImage.publicId)
  ) {
    removedPublicIds.push(project.mainImagePublicId);
  }

  const nextGalleryIds = new Set(galleryImages.map((image) => image.publicId));
  for (const image of project.images) {
    if (image.publicId && !nextGalleryIds.has(image.publicId)) {
      removedPublicIds.push(image.publicId);
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.project.update({
      where: { id: project.id },
      data: {
        mainImageUrl: mainImage?.url ?? null,
        mainImagePublicId: mainImage?.publicId ?? null,
      },
    });

    await tx.projectImage.deleteMany({
      where: { projectId: project.id },
    });

    if (galleryImages.length > 0) {
      await tx.projectImage.createMany({
        data: galleryImages.map((image) => ({
          projectId: project.id,
          imageUrl: image.url,
          publicId: image.publicId ?? null,
        })),
      });
    }
  });

  if (removedPublicIds.length > 0) {
    await deleteUploadedImages(removedPublicIds);
  }

  revalidatePath("/", "layout");

  return { success: true };
}
