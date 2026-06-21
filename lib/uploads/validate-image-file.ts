import {
  ALLOWED_IMAGE_EXTENSIONS,
  MAX_IMAGE_SIZE_BYTES,
} from "@/lib/uploads/image-upload-constants";
import { isAllowedDeclaredMime } from "@/lib/uploads/normalize-image-mime";

export type ImageValidationCode =
  | "imageRequired"
  | "imageTooLarge"
  | "imageInvalidType";

export type ImageValidationResult =
  | { ok: true }
  | { ok: false; code: ImageValidationCode };

function getExtension(filename: string): string {
  const parts = filename.toLowerCase().split(".");
  return parts.length > 1 ? parts.at(-1)! : "";
}

export function validateImageFile(file: File): ImageValidationResult {
  if (!file || file.size === 0) {
    return { ok: false, code: "imageRequired" };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return { ok: false, code: "imageTooLarge" };
  }

  const extension = getExtension(file.name);
  const mimeAllowed = isAllowedDeclaredMime(file.type);
  const extensionAllowed = ALLOWED_IMAGE_EXTENSIONS.includes(
    extension as (typeof ALLOWED_IMAGE_EXTENSIONS)[number],
  );

  if (!extensionAllowed || !mimeAllowed) {
    return { ok: false, code: "imageInvalidType" };
  }

  return { ok: true };
}
