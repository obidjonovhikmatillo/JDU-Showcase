import "server-only";

import { MAX_IMAGE_SIZE_BYTES } from "@/lib/uploads/image-upload-constants";
import { detectImageType } from "@/lib/uploads/detect-image-type";
import { normalizeDeclaredMime } from "@/lib/uploads/normalize-image-mime";

export { detectImageType } from "@/lib/uploads/detect-image-type";
export type { DetectedImageType } from "@/lib/uploads/detect-image-type";

export function validateImageBuffer(
  buffer: Buffer,
  declaredMime: string,
): { ok: true; mime: string } | { ok: false } {
  if (buffer.length === 0 || buffer.length > MAX_IMAGE_SIZE_BYTES) {
    return { ok: false };
  }

  const detected = detectImageType(buffer);
  if (!detected) {
    return { ok: false };
  }

  const mime = normalizeDeclaredMime(declaredMime, detected);
  if (!mime) {
    return { ok: false };
  }

  return { ok: true, mime };
}
