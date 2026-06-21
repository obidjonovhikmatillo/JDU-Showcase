import type { DetectedImageType } from "@/lib/uploads/detect-image-type";
import { ALLOWED_IMAGE_MIME_TYPES } from "@/lib/uploads/image-upload-constants";

const MIME_BY_TYPE: Record<DetectedImageType, (typeof ALLOWED_IMAGE_MIME_TYPES)[number]> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

const DECLARED_MIME_ALIASES: Record<string, (typeof ALLOWED_IMAGE_MIME_TYPES)[number]> = {
  "image/jpg": "image/jpeg",
  "image/pjpeg": "image/jpeg",
  "image/x-png": "image/png",
};

export function mimeForDetectedType(detected: DetectedImageType) {
  return MIME_BY_TYPE[detected];
}

export function normalizeDeclaredMime(
  declaredMime: string,
  detected: DetectedImageType,
): (typeof ALLOWED_IMAGE_MIME_TYPES)[number] | null {
  const expected = MIME_BY_TYPE[detected];
  const normalized = declaredMime.trim().toLowerCase();

  if (!normalized) {
    return expected;
  }

  if (normalized === expected) {
    return expected;
  }

  const alias = DECLARED_MIME_ALIASES[normalized];
  if (alias === expected) {
    return expected;
  }

  return null;
}

export function isAllowedDeclaredMime(declaredMime: string): boolean {
  const normalized = declaredMime.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  if (ALLOWED_IMAGE_MIME_TYPES.includes(normalized as (typeof ALLOWED_IMAGE_MIME_TYPES)[number])) {
    return true;
  }

  return normalized in DECLARED_MIME_ALIASES;
}
