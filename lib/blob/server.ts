import "server-only";

import { del, put } from "@vercel/blob";

import { UPLOAD_FOLDERS, type UploadFolderKey } from "@/lib/uploads/image-upload-constants";
import type { UploadedImage } from "@/lib/uploads/image-upload-types";
import {
  generateUploadPathname,
  isFolderScopedPublicId,
} from "@/lib/uploads/upload-ids";

const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";

export function isBlobConfigured() {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  return Boolean(token && !token.includes("replace-with"));
}

function getBlobToken() {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();

  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured.");
  }

  return token;
}

export function isManagedBlobUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.hostname.endsWith(BLOB_HOST_SUFFIX);
  } catch {
    return false;
  }
}

export function isManagedBlobPublicId(publicId: string, folderKey: UploadFolderKey) {
  return isFolderScopedPublicId(publicId, folderKey) && /\.(jpe?g|png|webp)$/i.test(publicId);
}

export function isBlobPublicId(publicId: string) {
  return Object.values(UPLOAD_FOLDERS).some((folder) =>
    publicId.startsWith(`${folder}/`),
  ) && /\.(jpe?g|png|webp)$/i.test(publicId);
}

export async function uploadBlobImageBuffer(
  buffer: Buffer,
  folderKey: UploadFolderKey,
  mime: string,
): Promise<UploadedImage> {
  const pathname = generateUploadPathname(folderKey, mime);
  const token = getBlobToken();

  const result = await put(pathname, buffer, {
    access: "public",
    contentType: mime,
    token,
    addRandomSuffix: false,
  });

  return {
    url: result.url,
    publicId: result.pathname,
  };
}

export async function deleteBlobImages(pathnamesOrUrls: string[]) {
  if (pathnamesOrUrls.length === 0) {
    return;
  }

  const token = getBlobToken();
  await del(pathnamesOrUrls, { token });
}
