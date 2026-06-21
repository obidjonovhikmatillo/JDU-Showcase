"use server";

import { revalidatePath } from "next/cache";
import { getLocale, getTranslations } from "next-intl/server";

import { auth } from "@/auth";
import {
  deleteUploadedImages,
  isManagedUploadPublicId,
  isManagedUploadUrl,
} from "@/lib/uploads/image-storage.server";
import { getRestaurantAverageRating } from "@/lib/data/restaurant-detail.server";
import prisma from "@/lib/prisma";
import { canManageReview } from "@/lib/reviews/permissions";
import {
  createDeleteReviewSchema,
  createReviewSchema,
  createUpdateReviewSchema,
  parseReviewImagesField,
} from "@/lib/validations/create-review-schema";

export type ReviewActionState = {
  success?: boolean;
  error?: string;
  forbidden?: boolean;
  fieldErrors?: Record<string, string[]>;
  averageRating?: number | null;
  reviewCount?: number;
};

export type CreateReviewActionState = ReviewActionState;

async function revalidateRestaurantDetail(slug: string) {
  const locale = await getLocale();
  revalidatePath(`/${locale}/restaurants/${slug}`);
}

async function revalidateProfilePage() {
  const locale = await getLocale();
  revalidatePath(`/${locale}/profile`);
}

async function buildRatingResult(restaurantId: string) {
  const { averageRating, reviewCount } = await getRestaurantAverageRating(restaurantId);

  return { averageRating, reviewCount };
}

function validateReviewImages(
  images: Array<{ url: string; publicId?: string }>,
): string | null {
  for (const image of images) {
    if (!image.publicId) {
      continue;
    }

    if (
      !isManagedUploadUrl(image.url) ||
      !isManagedUploadPublicId(image.publicId, "review")
    ) {
      return "INVALID_IMAGES";
    }
  }

  return null;
}

export async function createReview(
  _prevState: CreateReviewActionState,
  formData: FormData,
): Promise<CreateReviewActionState> {
  const session = await auth();
  const tErrors = await getTranslations("Errors");
  const tValidation = await getTranslations("Validation");

  if (!session?.user?.id) {
    return { error: tErrors("mustBeSignedInToReview") };
  }

  const raw = {
    restaurantSlug: formData.get("restaurantSlug"),
    rating: Number(formData.get("rating")),
    title: formData.get("title"),
    content: formData.get("content"),
    visitDate: formData.get("visitDate"),
    images: formData.get("images") ?? "",
  };

  const reviewSchema = createReviewSchema((key) => tValidation(key));
  const parsed = reviewSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  let uploadedImages;
  try {
    uploadedImages = parseReviewImagesField(raw.images, (key) => tValidation(key));
  } catch {
    return { error: tValidation("reviewImagesInvalid") };
  }

  const imageValidationError = validateReviewImages(uploadedImages);
  if (imageValidationError) {
    return { error: tValidation("reviewImagesInvalid") };
  }

  const restaurant = await prisma.restaurant.findFirst({
    where: {
      slug: parsed.data.restaurantSlug,
      isPublished: true,
    },
    select: { id: true, slug: true },
  });

  if (!restaurant) {
    return { error: tErrors("restaurantNotFound") };
  }

  await prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        userId: session.user.id,
        restaurantId: restaurant.id,
        rating: parsed.data.rating,
        title: parsed.data.title,
        content: parsed.data.content,
        visitDate: new Date(`${parsed.data.visitDate}T12:00:00.000`),
      },
    });

    if (uploadedImages.length > 0) {
      await tx.reviewImage.createMany({
        data: uploadedImages.map((image) => ({
          reviewId: review.id,
          imageUrl: image.url,
          publicId: image.publicId ?? null,
        })),
      });
    }
  });

  await revalidateRestaurantDetail(restaurant.slug);
  await revalidateProfilePage();

  return {
    success: true,
    ...(await buildRatingResult(restaurant.id)),
  };
}

export async function updateReview(
  _prevState: ReviewActionState,
  formData: FormData,
): Promise<ReviewActionState> {
  const session = await auth();
  const tErrors = await getTranslations("Errors");
  const tValidation = await getTranslations("Validation");

  if (!session?.user?.id) {
    return { error: tErrors("mustBeSignedInToReview") };
  }

  const raw = {
    reviewId: formData.get("reviewId"),
    restaurantSlug: formData.get("restaurantSlug"),
    rating: Number(formData.get("rating")),
    title: formData.get("title"),
    content: formData.get("content"),
    visitDate: formData.get("visitDate"),
    images: formData.get("images") ?? "",
  };

  const updateSchema = createUpdateReviewSchema((key) => tValidation(key));
  const parsed = updateSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  let uploadedImages;
  try {
    uploadedImages = parseReviewImagesField(raw.images, (key) => tValidation(key));
  } catch {
    return { error: tValidation("reviewImagesInvalid") };
  }

  const imageValidationError = validateReviewImages(uploadedImages);
  if (imageValidationError) {
    return { error: tValidation("reviewImagesInvalid") };
  }

  const review = await prisma.review.findUnique({
    where: { id: parsed.data.reviewId },
    select: {
      id: true,
      userId: true,
      images: {
        select: {
          id: true,
          imageUrl: true,
          publicId: true,
        },
      },
      restaurant: {
        select: {
          id: true,
          slug: true,
          isPublished: true,
        },
      },
    },
  });

  if (!review || !review.restaurant.isPublished) {
    return { error: tErrors("reviewNotFound") };
  }

  if (review.restaurant.slug !== parsed.data.restaurantSlug) {
    return { error: tErrors("reviewNotFound") };
  }

  if (
    !canManageReview(
      { id: session.user.id, role: session.user.role },
      review.userId,
    )
  ) {
    return { forbidden: true, error: tErrors("reviewForbidden") };
  }

  const nextPublicIds = new Set(uploadedImages.map((image) => image.publicId));
  const removedPublicIds = review.images
    .map((image) => image.publicId)
    .filter((publicId): publicId is string => Boolean(publicId))
    .filter((publicId) => !nextPublicIds.has(publicId));

  await prisma.$transaction(async (tx) => {
    await tx.review.update({
      where: { id: review.id },
      data: {
        rating: parsed.data.rating,
        title: parsed.data.title,
        content: parsed.data.content,
        visitDate: new Date(`${parsed.data.visitDate}T12:00:00.000`),
      },
    });

    await tx.reviewImage.deleteMany({
      where: { reviewId: review.id },
    });

    if (uploadedImages.length > 0) {
      await tx.reviewImage.createMany({
        data: uploadedImages.map((image) => ({
          reviewId: review.id,
          imageUrl: image.url,
          publicId: image.publicId ?? null,
        })),
      });
    }
  });

  if (removedPublicIds.length > 0) {
    await deleteUploadedImages(removedPublicIds);
  }

  await revalidateRestaurantDetail(review.restaurant.slug);
  await revalidateProfilePage();

  return {
    success: true,
    ...(await buildRatingResult(review.restaurant.id)),
  };
}

export async function deleteReview(
  _prevState: ReviewActionState,
  formData: FormData,
): Promise<ReviewActionState> {
  const session = await auth();
  const tErrors = await getTranslations("Errors");
  const tValidation = await getTranslations("Validation");

  if (!session?.user?.id) {
    return { error: tErrors("mustBeSignedInToReview") };
  }

  const raw = {
    reviewId: formData.get("reviewId"),
    restaurantSlug: formData.get("restaurantSlug"),
  };

  const deleteSchema = createDeleteReviewSchema((key) => tValidation(key));
  const parsed = deleteSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const review = await prisma.review.findUnique({
    where: { id: parsed.data.reviewId },
    select: {
      id: true,
      userId: true,
      images: {
        select: { publicId: true },
      },
      restaurant: {
        select: {
          id: true,
          slug: true,
          isPublished: true,
        },
      },
    },
  });

  if (!review || !review.restaurant.isPublished) {
    return { error: tErrors("reviewNotFound") };
  }

  if (review.restaurant.slug !== parsed.data.restaurantSlug) {
    return { error: tErrors("reviewNotFound") };
  }

  if (
    !canManageReview(
      { id: session.user.id, role: session.user.role },
      review.userId,
    )
  ) {
    return { forbidden: true, error: tErrors("reviewForbidden") };
  }

  const publicIds = review.images
    .map((image) => image.publicId)
    .filter((publicId): publicId is string => Boolean(publicId));

  await prisma.$transaction(async (tx) => {
    await tx.reviewImage.deleteMany({
      where: { reviewId: review.id },
    });

    await tx.review.delete({
      where: { id: review.id },
    });
  });

  if (publicIds.length > 0) {
    await deleteUploadedImages(publicIds);
  }

  await revalidateRestaurantDetail(review.restaurant.slug);
  await revalidateProfilePage();

  return {
    success: true,
    ...(await buildRatingResult(review.restaurant.id)),
  };
}
