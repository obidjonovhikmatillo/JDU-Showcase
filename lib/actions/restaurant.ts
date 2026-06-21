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

export type RestaurantImagesActionState = {
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
      isManagedUploadPublicId(image.publicId, "restaurantGallery")
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
    isManagedUploadPublicId(image.publicId, "restaurantMain")
  );
}

export async function updateRestaurantImages(
  _prevState: RestaurantImagesActionState,
  formData: FormData,
): Promise<RestaurantImagesActionState> {
  const session = await auth();
  const tErrors = await getTranslations("Errors");
  const tValidation = await getTranslations("Validation");

  if (!session?.user?.id || !ensureAdmin(session.user.role)) {
    return { forbidden: true, error: tErrors("adminRequired") };
  }

  const restaurantSlug = formData.get("restaurantSlug");
  const mainImageRaw = formData.get("mainImage");
  const galleryRaw = formData.get("galleryImages") ?? "[]";

  if (typeof restaurantSlug !== "string" || !restaurantSlug.trim()) {
    return { error: tErrors("restaurantNotFound") };
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

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug: restaurantSlug },
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

  if (!restaurant) {
    return { error: tErrors("restaurantNotFound") };
  }

  const removedPublicIds: string[] = [];

  if (
    restaurant.mainImagePublicId &&
    (!mainImage || restaurant.mainImagePublicId !== mainImage.publicId)
  ) {
    removedPublicIds.push(restaurant.mainImagePublicId);
  }

  const nextGalleryIds = new Set(galleryImages.map((image) => image.publicId));
  for (const image of restaurant.images) {
    if (image.publicId && !nextGalleryIds.has(image.publicId)) {
      removedPublicIds.push(image.publicId);
    }
  }

  await prisma.$transaction(async (tx) => {
    await tx.restaurant.update({
      where: { id: restaurant.id },
      data: {
        mainImageUrl: mainImage?.url ?? null,
        mainImagePublicId: mainImage?.publicId ?? null,
      },
    });

    await tx.restaurantImage.deleteMany({
      where: { restaurantId: restaurant.id },
    });

    if (galleryImages.length > 0) {
      await tx.restaurantImage.createMany({
        data: galleryImages.map((image) => ({
          restaurantId: restaurant.id,
          imageUrl: image.url,
          publicId: image.publicId ?? null,
        })),
      });
    }
  });

  if (removedPublicIds.length > 0) {
    await deleteUploadedImages(removedPublicIds);
  }

  const locale = await getLocale();
  revalidatePath(`/${locale}/restaurants/${restaurant.slug}`);
  revalidatePath(`/${locale}/admin/restaurants`);
  revalidatePath(`/${locale}/admin/restaurants/${restaurant.slug}/edit`);

  return { success: true };
}
