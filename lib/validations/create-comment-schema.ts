import { z } from "zod";

import {
  MAX_COMMENT_RATING,
  MIN_COMMENT_RATING,
} from "@/lib/validation/comment";
import {
  createCommentImagesSchema,
} from "@/lib/validations/uploaded-images-schema";
import type { ExistingUploadedImage } from "@/lib/uploads/image-upload-types";

type TranslateValidation = (key: string) => string;

function commentContentFields(tv: TranslateValidation) {
  return {
    rating: z
      .number({
        message: tv("ratingRequired"),
      })
      .int(tv("ratingInvalid"))
      .min(MIN_COMMENT_RATING, tv("ratingInvalid"))
      .max(MAX_COMMENT_RATING, tv("ratingInvalid")),
    title: z.string().trim().min(1, tv("commentTitleRequired")),
    content: z.string().trim().min(1, tv("commentContentRequired")),
  };
}

export function parseCommentImagesField(
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
    throw new Error("INVALID_COMMENT_IMAGES");
  }

  try {
    return createCommentImagesSchema(tv).parse(parsed);
  } catch {
    throw new Error("INVALID_COMMENT_IMAGES");
  }
}

export function createCommentSchema(tv: TranslateValidation) {
  return z.object({
    projectSlug: z.string().trim().min(1, tv("projectRequired")),
    ...commentContentFields(tv),
    images: z.string().optional(),
  });
}

export function createUpdateCommentSchema(tv: TranslateValidation) {
  return z.object({
    commentId: z.string().trim().min(1, tv("commentRequired")),
    projectSlug: z.string().trim().min(1, tv("projectRequired")),
    ...commentContentFields(tv),
    images: z.string().optional(),
  });
}

export function createDeleteCommentSchema(tv: TranslateValidation) {
  return z.object({
    commentId: z.string().trim().min(1, tv("commentRequired")),
    projectSlug: z.string().trim().min(1, tv("projectRequired")),
  });
}

export type CommentInput = z.infer<ReturnType<typeof createCommentSchema>>;
export type CommentFormValues = CommentInput;
export type UpdateCommentInput = z.infer<ReturnType<typeof createUpdateCommentSchema>>;
export type DeleteCommentInput = z.infer<ReturnType<typeof createDeleteCommentSchema>>;
