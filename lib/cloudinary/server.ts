import "server-only";

import { randomUUID } from "crypto";

import { v2 as cloudinary } from "cloudinary";

import { UPLOAD_FOLDERS, type UploadFolderKey } from "@/lib/uploads/image-upload-constants";
import type { UploadedImage } from "@/lib/uploads/image-upload-types";

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary environment variables are not configured.");
  }

  return { cloudName, apiKey, apiSecret };
}

export function isCloudinaryConfigured() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  return Boolean(
    cloudName &&
      apiKey &&
      apiSecret &&
      !cloudName.includes("your_") &&
      !apiKey.includes("your_") &&
      !apiSecret.includes("your_"),
  );
}

export function getCloudinaryCloudName() {
  return getCloudinaryConfig().cloudName;
}

export function configureCloudinary() {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
}

export function generateSafePublicId(folderKey: UploadFolderKey) {
  const folder = UPLOAD_FOLDERS[folderKey];
  return `${folder}/${randomUUID()}`;
}

export async function uploadCloudinaryImageBuffer(
  buffer: Buffer,
  folderKey: UploadFolderKey,
  publicId: string,
): Promise<UploadedImage> {
  const instance = configureCloudinary();

  const result = await new Promise<UploadedImage>((resolve, reject) => {
    const stream = instance.uploader.upload_stream(
      {
        public_id: publicId,
        folder: undefined,
        overwrite: false,
        resource_type: "image",
      },
      (error, uploadResult) => {
        if (error || !uploadResult?.secure_url || !uploadResult.public_id) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }

        resolve({
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
        });
      },
    );

    stream.end(buffer);
  });

  return result;
}

/** @deprecated Use uploadCloudinaryImageBuffer or lib/uploads/image-storage.server.ts */
export async function uploadImageBuffer(
  buffer: Buffer,
  folderKey: UploadFolderKey,
): Promise<UploadedImage> {
  return uploadCloudinaryImageBuffer(buffer, folderKey, generateSafePublicId(folderKey));
}

export async function deleteCloudinaryImages(publicIds: string[]) {
  if (publicIds.length === 0) {
    return;
  }

  const instance = configureCloudinary();
  await instance.api.delete_resources(publicIds, { resource_type: "image" });
}

export function isManagedCloudinaryUrl(url: string): boolean {
  if (!isCloudinaryConfigured()) {
    return false;
  }

  try {
    const parsed = new URL(url);
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;

    return (
      parsed.hostname === "res.cloudinary.com" &&
      parsed.pathname.startsWith(`/${cloudName}/`)
    );
  } catch {
    return false;
  }
}

export function isManagedCloudinaryPublicId(publicId: string, folderKey: UploadFolderKey) {
  return publicId.startsWith(`${UPLOAD_FOLDERS[folderKey]}/`);
}
