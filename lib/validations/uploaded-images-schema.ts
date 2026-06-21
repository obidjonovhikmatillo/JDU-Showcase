import { z } from "zod";

import {
  MAX_RESTAURANT_GALLERY_IMAGES,
  MAX_REVIEW_IMAGES,
} from "@/lib/uploads/image-upload-constants";
import type { UploadedImage } from "@/lib/uploads/image-upload-types";
import { isValidUploadedImageUrl } from "@/lib/uploads/uploaded-image-url";

const uploadedImageUrlSchema = z.string().refine(isValidUploadedImageUrl, {
  message: "urlInvalid",
});

export const uploadedImageSchema = z.object({
  url: uploadedImageUrlSchema,
  publicId: z.string().trim().min(1),
});

export const persistedImageSchema = z.object({
  url: uploadedImageUrlSchema,
  publicId: z.string().optional(),
});

export function parsePersistedImagesJson(
  raw: FormDataEntryValue | null,
): Array<{ url: string; publicId?: string }> {
  if (!raw || typeof raw !== "string" || raw.trim() === "") {
    return [];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("INVALID_IMAGES_JSON");
  }

  return z.array(persistedImageSchema).parse(parsed);
}

export function parseUploadedImagesJson(raw: FormDataEntryValue | null): UploadedImage[] {
  if (!raw || typeof raw !== "string" || raw.trim() === "") {
    return [];
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("INVALID_IMAGES_JSON");
  }

  return z.array(uploadedImageSchema).parse(parsed);
}

export function createReviewImagesSchema(tv: (key: string) => string) {
  return z
    .array(persistedImageSchema)
    .max(MAX_REVIEW_IMAGES, tv("reviewImagesMax"));
}

export function createGalleryImagesSchema(tv: (key: string) => string) {
  return z
    .array(persistedImageSchema)
    .max(MAX_RESTAURANT_GALLERY_IMAGES, tv("galleryImagesMax"));
}

export function createMainImageSchema(tv: (key: string) => string) {
  return uploadedImageSchema.nullable().refine(Boolean, {
    message: tv("mainImageRequired"),
  });
}
