import { z } from "zod";

import {
  MAX_REVIEW_RATING,
  MIN_REVIEW_RATING,
} from "@/lib/validation/review";
import {
  createReviewImagesSchema,
} from "@/lib/validations/uploaded-images-schema";
import type { ExistingUploadedImage } from "@/lib/uploads/image-upload-types";

type TranslateValidation = (key: string) => string;

function isVisitDateNotInFuture(value: string): boolean {
  const date = new Date(`${value}T23:59:59.999`);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  return date <= today;
}

function reviewContentFields(tv: TranslateValidation) {
  return {
    rating: z
      .number({
        message: tv("ratingRequired"),
      })
      .int(tv("ratingInvalid"))
      .min(MIN_REVIEW_RATING, tv("ratingInvalid"))
      .max(MAX_REVIEW_RATING, tv("ratingInvalid")),
    title: z.string().trim().min(1, tv("reviewTitleRequired")),
    content: z.string().trim().min(1, tv("reviewContentRequired")),
    visitDate: z
      .string()
      .trim()
      .min(1, tv("visitDateRequired"))
      .refine(isVisitDateNotInFuture, { message: tv("visitDateFuture") }),
  };
}

export function parseReviewImagesField(
  raw: FormDataEntryValue | null,
  tv: TranslateValidation,
): ExistingUploadedImage[] {
  if (!raw || typeof raw !== "string" || raw.trim() === "") {
    return [];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("INVALID_REVIEW_IMAGES");
  }

  try {
    return createReviewImagesSchema(tv).parse(parsed);
  } catch {
    throw new Error("INVALID_REVIEW_IMAGES");
  }
}

export function createReviewSchema(tv: TranslateValidation) {
  return z.object({
    restaurantSlug: z.string().trim().min(1, tv("restaurantRequired")),
    ...reviewContentFields(tv),
    images: z.string().optional(),
  });
}

export function createUpdateReviewSchema(tv: TranslateValidation) {
  return z.object({
    reviewId: z.string().trim().min(1, tv("reviewRequired")),
    restaurantSlug: z.string().trim().min(1, tv("restaurantRequired")),
    ...reviewContentFields(tv),
    images: z.string().optional(),
  });
}

export function createDeleteReviewSchema(tv: TranslateValidation) {
  return z.object({
    reviewId: z.string().trim().min(1, tv("reviewRequired")),
    restaurantSlug: z.string().trim().min(1, tv("restaurantRequired")),
  });
}

export type ReviewInput = z.infer<ReturnType<typeof createReviewSchema>>;
export type ReviewFormValues = ReviewInput;
export type UpdateReviewInput = z.infer<ReturnType<typeof createUpdateReviewSchema>>;
export type DeleteReviewInput = z.infer<ReturnType<typeof createDeleteReviewSchema>>;
