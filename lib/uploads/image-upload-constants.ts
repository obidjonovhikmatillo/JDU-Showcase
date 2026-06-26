export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"] as const;

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const MAX_COMMENT_IMAGES = 4;
export const MAX_PROJECT_GALLERY_IMAGES = 8;
export const MAX_AVATAR_IMAGES = 1;

export const UPLOAD_FOLDERS = {
  comment: "jdu-showcase/comments",
  projectMain: "jdu-showcase/projects/main",
  projectGallery: "jdu-showcase/projects/gallery",
  avatar: "jdu-showcase/avatars",
} as const;

export type UploadFolderKey = keyof typeof UPLOAD_FOLDERS;
