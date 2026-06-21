import "server-only";

import {
  deleteCloudinaryImages,
  generateSafePublicId,
  isCloudinaryConfigured,
  isManagedCloudinaryPublicId,
  isManagedCloudinaryUrl,
  uploadCloudinaryImageBuffer,
} from "@/lib/cloudinary/server";
import type { UploadFolderKey } from "@/lib/uploads/image-upload-constants";
import type { UploadedImage } from "@/lib/uploads/image-upload-types";
import {
  deleteLocalImages,
  isLocalUploadPublicId,
  isLocalUploadUrl,
  uploadImageBufferLocally,
} from "@/lib/uploads/local-storage.server";

export function isUploadStorageAvailable() {
  return isCloudinaryConfigured() || process.env.NODE_ENV === "development";
}

export function isManagedUploadPublicId(publicId: string, folderKey: UploadFolderKey) {
  return isManagedCloudinaryPublicId(publicId, folderKey) || isLocalUploadPublicId(publicId);
}

export function isManagedUploadUrl(url: string) {
  if (isLocalUploadUrl(url)) {
    return true;
  }

  if (!isCloudinaryConfigured()) {
    return false;
  }

  return isManagedCloudinaryUrl(url);
}

export async function uploadImageBuffer(
  buffer: Buffer,
  folderKey: UploadFolderKey,
  mime: string,
): Promise<UploadedImage> {
  const publicId = generateSafePublicId(folderKey);

  if (isCloudinaryConfigured()) {
    return uploadCloudinaryImageBuffer(buffer, folderKey, publicId);
  }

  if (process.env.NODE_ENV === "development") {
    return uploadImageBufferLocally(buffer, folderKey, publicId, mime);
  }

  throw new Error("Upload storage is not configured.");
}

export async function deleteUploadedImages(publicIds: string[]) {
  if (publicIds.length === 0) {
    return;
  }

  await deleteLocalImages(publicIds);

  if (isCloudinaryConfigured()) {
    await deleteCloudinaryImages(publicIds);
  }
}
