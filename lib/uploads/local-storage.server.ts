import "server-only";

import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

import { UPLOAD_FOLDERS, type UploadFolderKey } from "@/lib/uploads/image-upload-constants";
import type { UploadedImage } from "@/lib/uploads/image-upload-types";

const LOCAL_UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");
const LOCAL_UPLOAD_PREFIX = "/uploads";

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function localPaths(publicId: string, extension: string) {
  const segments = publicId.split("/");
  const fileName = `${segments.at(-1)!}.${extension}`;
  const folderParts = segments.slice(0, -1);

  return {
    filePath: path.join(LOCAL_UPLOAD_ROOT, ...folderParts, fileName),
    url: `${LOCAL_UPLOAD_PREFIX}/${folderParts.join("/")}/${fileName}`,
  };
}

export function isLocalUploadPublicId(publicId: string) {
  return Object.values(UPLOAD_FOLDERS).some((folder) => publicId.startsWith(`${folder}/`));
}

export function isLocalUploadUrl(url: string) {
  try {
    const parsed = new URL(url, "http://localhost");
    return parsed.pathname.startsWith(`${LOCAL_UPLOAD_PREFIX}/`);
  } catch {
    return url.startsWith(`${LOCAL_UPLOAD_PREFIX}/`);
  }
}

export async function uploadImageBufferLocally(
  buffer: Buffer,
  folderKey: UploadFolderKey,
  publicId: string,
  mime: string,
): Promise<UploadedImage> {
  void folderKey;

  const extension = EXTENSION_BY_MIME[mime];
  if (!extension) {
    throw new Error("Unsupported image mime type for local storage.");
  }

  const { filePath, url: relativeUrl } = localPaths(publicId, extension);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, buffer);

  return { url: relativeUrl, publicId };
}

export async function deleteLocalImages(publicIds: string[]) {
  await Promise.all(
    publicIds.flatMap((publicId) =>
      Object.values(EXTENSION_BY_MIME).map(async (extension) => {
        const { filePath } = localPaths(publicId, extension);

        try {
          await unlink(filePath);
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
            throw error;
          }
        }
      }),
    ),
  );
}
