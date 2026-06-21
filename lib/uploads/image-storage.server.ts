import "server-only";

import {
  deleteBlobImages,
  isBlobConfigured,
  isBlobPublicId,
  isManagedBlobUrl,
  uploadBlobImageBuffer,
} from "@/lib/blob/server";
import type { UploadFolderKey } from "@/lib/uploads/image-upload-constants";
import type { UploadedImage } from "@/lib/uploads/image-upload-types";
import { generateLocalPublicId, isFolderScopedPublicId } from "@/lib/uploads/upload-ids";
import {
  deleteLocalImages,
  isLocalUploadUrl,
  uploadImageBufferLocally,
} from "@/lib/uploads/local-storage.server";

export function isUploadStorageAvailable() {
  return isBlobConfigured() || process.env.NODE_ENV === "development";
}

export function isManagedUploadPublicId(publicId: string, folderKey: UploadFolderKey) {
  return isFolderScopedPublicId(publicId, folderKey);
}

export function isManagedUploadUrl(url: string) {
  if (isLocalUploadUrl(url)) {
    return true;
  }

  if (isBlobConfigured()) {
    return isManagedBlobUrl(url);
  }

  return false;
}

export async function uploadImageBuffer(
  buffer: Buffer,
  folderKey: UploadFolderKey,
  mime: string,
): Promise<UploadedImage> {
  if (isBlobConfigured()) {
    return uploadBlobImageBuffer(buffer, folderKey, mime);
  }

  if (process.env.NODE_ENV === "development") {
    return uploadImageBufferLocally(buffer, folderKey, generateLocalPublicId(folderKey), mime);
  }

  throw new Error("Upload storage is not configured.");
}

export async function deleteUploadedImages(publicIds: string[]) {
  if (publicIds.length === 0) {
    return;
  }

  const blobIds = publicIds.filter((publicId) => isBlobPublicId(publicId));
  const localIds = publicIds.filter((publicId) => !isBlobPublicId(publicId));

  await deleteLocalImages(localIds);

  if (blobIds.length > 0 && isBlobConfigured()) {
    await deleteBlobImages(blobIds);
  }
}
