"use client";

import type { UploadFolderKey } from "@/lib/uploads/image-upload-constants";
import type { UploadedImage } from "@/lib/uploads/image-upload-types";

const API_FOLDER: Record<UploadFolderKey, string> = {
  review: "review",
  restaurantMain: "restaurant-main",
  restaurantGallery: "restaurant-gallery",
  avatar: "avatar",
};

export async function uploadImageFile(
  file: File,
  folderKey: UploadFolderKey,
): Promise<UploadedImage> {
  const formData = new FormData();
  formData.set("file", file);
  formData.set("folder", API_FOLDER[folderKey]);

  const response = await fetch("/api/uploads", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? "UPLOAD_FAILED");
  }

  return response.json() as Promise<UploadedImage>;
}

export async function deleteUploadedImage(
  publicId: string,
  folderKey: UploadFolderKey,
): Promise<void> {
  const response = await fetch("/api/uploads", {
    method: "DELETE",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      publicId,
      folder: API_FOLDER[folderKey],
    }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? "DELETE_FAILED");
  }
}
