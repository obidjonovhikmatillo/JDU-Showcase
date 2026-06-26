import { NextResponse } from "next/server";

import { auth } from "@/auth";
import {
  deleteUploadedImages,
  isManagedUploadPublicId,
  isUploadStorageAvailable,
  uploadImageBuffer,
} from "@/lib/uploads/image-storage.server";
import {
  type UploadFolderKey,
} from "@/lib/uploads/image-upload-constants";
import { validateImageBuffer } from "@/lib/uploads/validate-image-buffer.server";

const FOLDER_FIELD_MAP: Record<string, UploadFolderKey> = {
  comment: "comment",
  "project-main": "projectMain",
  "project-gallery": "projectGallery",
  avatar: "avatar",
};

function canUploadFolder(
  folderKey: UploadFolderKey,
  role: string | undefined,
): boolean {
  if (folderKey === "comment" || folderKey === "avatar") {
    return Boolean(role);
  }

  return role === "ADMIN";
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "INVALID_FORM_DATA" }, { status: 400 });
  }

  const folderField = formData.get("folder");
  const file = formData.get("file");

  if (typeof folderField !== "string" || !(folderField in FOLDER_FIELD_MAP)) {
    return NextResponse.json({ error: "INVALID_FOLDER" }, { status: 400 });
  }

  const folderKey = FOLDER_FIELD_MAP[folderField];

  if (!canUploadFolder(folderKey, session.user.role)) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  if (!isUploadStorageAvailable()) {
    return NextResponse.json({ error: "BLOB_NOT_CONFIGURED" }, { status: 503 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "FILE_REQUIRED" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const validated = validateImageBuffer(buffer, file.type);

  if (!validated.ok) {
    return NextResponse.json({ error: "INVALID_FILE" }, { status: 400 });
  }

  try {
    const uploaded = await uploadImageBuffer(buffer, folderKey, validated.mime);

    if (!isManagedUploadPublicId(uploaded.publicId, folderKey)) {
      await deleteUploadedImages([uploaded.publicId]);
      return NextResponse.json({ error: "UPLOAD_FAILED" }, { status: 500 });
    }

    return NextResponse.json(uploaded, { status: 201 });
  } catch {
    return NextResponse.json({ error: "UPLOAD_FAILED" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  let body: { publicId?: string; folder?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
  }

  const { publicId, folder } = body;

  if (!publicId || !folder || !(folder in FOLDER_FIELD_MAP)) {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const folderKey = FOLDER_FIELD_MAP[folder];

  if (!canUploadFolder(folderKey, session.user.role)) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  if (!isManagedUploadPublicId(publicId, folderKey)) {
    return NextResponse.json({ error: "INVALID_PUBLIC_ID" }, { status: 400 });
  }

  try {
    await deleteUploadedImages([publicId]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "DELETE_FAILED" }, { status: 500 });
  }
}
