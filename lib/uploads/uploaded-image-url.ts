import { getSiteUrl } from "@/lib/site-url";

const LOCAL_UPLOAD_PREFIX = "/uploads";

export function isLocalUploadPath(value: string) {
  const trimmed = value.trim();

  if (trimmed.startsWith(`${LOCAL_UPLOAD_PREFIX}/`)) {
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.pathname.startsWith(`${LOCAL_UPLOAD_PREFIX}/`);
  } catch {
    return false;
  }
}

export function normalizeImageSrcForDisplay(url: string) {
  const trimmed = url.trim();

  if (trimmed.startsWith(`${LOCAL_UPLOAD_PREFIX}/`)) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);

    if (parsed.pathname.startsWith(`${LOCAL_UPLOAD_PREFIX}/`)) {
      return parsed.pathname;
    }
  } catch {
    return trimmed;
  }

  return trimmed;
}

export function normalizeUploadedImageUrlForStorage(url: string | null | undefined) {
  if (!url) {
    return null;
  }

  const trimmed = url.trim();

  if (trimmed === "") {
    return null;
  }

  if (trimmed.startsWith(`${LOCAL_UPLOAD_PREFIX}/`)) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);

    if (parsed.pathname.startsWith(`${LOCAL_UPLOAD_PREFIX}/`)) {
      return parsed.pathname;
    }
  } catch {
    return trimmed;
  }

  return trimmed;
}

export function isValidUploadedImageUrl(value: string) {
  const trimmed = value.trim();

  if (trimmed.startsWith(`${LOCAL_UPLOAD_PREFIX}/`)) {
    return true;
  }

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function toAbsoluteUploadUrl(url: string) {
  if (!url.startsWith(`${LOCAL_UPLOAD_PREFIX}/`)) {
    return url;
  }

  const base = getSiteUrl().replace(/\/$/, "");

  return `${base}${url}`;
}
