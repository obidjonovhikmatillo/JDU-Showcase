import { randomUUID } from "crypto";

import { UPLOAD_FOLDERS, type UploadFolderKey } from "@/lib/uploads/image-upload-constants";

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function mimeToImageExtension(mime: string) {
  return EXTENSION_BY_MIME[mime] ?? null;
}

export function generateLocalPublicId(folderKey: UploadFolderKey) {
  return `${UPLOAD_FOLDERS[folderKey]}/${randomUUID()}`;
}

export function generateUploadPathname(folderKey: UploadFolderKey, mime: string) {
  const extension = mimeToImageExtension(mime);

  if (!extension) {
    throw new Error("Unsupported image mime type.");
  }

  return `${UPLOAD_FOLDERS[folderKey]}/${randomUUID()}.${extension}`;
}

export function isFolderScopedPublicId(publicId: string, folderKey: UploadFolderKey) {
  return publicId.startsWith(`${UPLOAD_FOLDERS[folderKey]}/`);
}
