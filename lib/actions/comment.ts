"use server";

import { revalidatePath } from "next/cache";
import { getLocale, getTranslations } from "next-intl/server";

import { auth } from "@/auth";
import {
  deleteUploadedImages,
  isManagedUploadPublicId,
  isManagedUploadUrl,
} from "@/lib/uploads/image-storage.server";
import { getProjectAverageRating } from "@/lib/data/project-detail.server";
import prisma from "@/lib/prisma";
import { canManageComment } from "@/lib/comments/permissions";
import {
  createDeleteCommentSchema,
  createCommentSchema,
  createUpdateCommentSchema,
  parseCommentImagesField,
} from "@/lib/validations/create-comment-schema";

export type CommentActionState = {
  success?: boolean;
  error?: string;
  forbidden?: boolean;
  fieldErrors?: Record<string, string[]>;
  averageRating?: number | null;
  commentCount?: number;
};

export type CreateCommentActionState = CommentActionState;

async function revalidateProjectDetail(slug: string) {
  const locale = await getLocale();
  revalidatePath(`/${locale}/projects/${slug}`);
}

async function revalidateProfilePage() {
  const locale = await getLocale();
  revalidatePath(`/${locale}/profile`);
}

async function buildRatingResult(projectId: string) {
  const { averageRating, commentCount } = await getProjectAverageRating(projectId);

  return { averageRating, commentCount };
}

function validateCommentImages(
  images: Array<{ url: string; publicId?: string }>,
): string | null {
  for (const image of images) {
    if (!image.publicId) {
      continue;
    }

    if (
      !isManagedUploadUrl(image.url) ||
      !isManagedUploadPublicId(image.publicId, "comment")
    ) {
      return "INVALID_IMAGES";
    }
  }

  return null;
}

export async function createComment(
  _prevState: CreateCommentActionState,
  formData: FormData,
): Promise<CreateCommentActionState> {
  const session = await auth();
  const tErrors = await getTranslations("Errors");
  const tValidation = await getTranslations("Validation");

  if (!session?.user?.id) {
    return { error: tErrors("mustBeSignedInToComment") };
  }

  const raw = {
    projectSlug: formData.get("projectSlug"),
    rating: Number(formData.get("rating")),
    title: formData.get("title"),
    content: formData.get("content"),
    images: formData.get("images") ?? "",
  };

  const commentSchema = createCommentSchema((key) => tValidation(key));
  const parsed = commentSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  let uploadedImages;
  try {
    uploadedImages = parseCommentImagesField(raw.images, (key) => tValidation(key));
  } catch {
    return { error: tValidation("commentImagesInvalid") };
  }

  const imageValidationError = validateCommentImages(uploadedImages);
  if (imageValidationError) {
    return { error: tValidation("commentImagesInvalid") };
  }

  const project = await prisma.project.findFirst({
    where: {
      slug: parsed.data.projectSlug,
      isPublished: true,
    },
    select: { id: true, slug: true },
  });

  if (!project) {
    return { error: tErrors("projectNotFound") };
  }

  await prisma.$transaction(async (tx) => {
    const comment = await tx.comment.create({
      data: {
        userId: session.user.id,
        projectId: project.id,
        rating: parsed.data.rating,
        title: parsed.data.title,
        content: parsed.data.content,
      },
    });

    if (uploadedImages.length > 0) {
      await tx.commentImage.createMany({
        data: uploadedImages.map((image) => ({
          commentId: comment.id,
          imageUrl: image.url,
          publicId: image.publicId ?? null,
        })),
      });
    }
  });

  await revalidateProjectDetail(project.slug);
  await revalidateProfilePage();

  return {
    success: true,
    ...(await buildRatingResult(project.id)),
  };
}

export async function updateComment(
  _prevState: CommentActionState,
  formData: FormData,
): Promise<CommentActionState> {
  const session = await auth();
  const tErrors = await getTranslations("Errors");
  const tValidation = await getTranslations("Validation");

  if (!session?.user?.id) {
    return { error: tErrors("mustBeSignedInToComment") };
  }

  const raw = {
    commentId: formData.get("commentId"),
    projectSlug: formData.get("projectSlug"),
    rating: Number(formData.get("rating")),
    title: formData.get("title"),
    content: formData.get("content"),
    images: formData.get("images") ?? "",
  };

  const updateSchema = createUpdateCommentSchema((key) => tValidation(key));
  const parsed = updateSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  let uploadedImages;
  try {
    uploadedImages = parseCommentImagesField(raw.images, (key) => tValidation(key));
  } catch {
    return { error: tValidation("commentImagesInvalid") };
  }

  const imageValidationError = validateCommentImages(uploadedImages);
  if (imageValidationError) {
    return { error: tValidation("commentImagesInvalid") };
  }

  const comment = await prisma.comment.findUnique({
    where: { id: parsed.data.commentId },
    select: {
      id: true,
      userId: true,
      images: {
        select: {
          id: true,
          imageUrl: true,
          publicId: true,
        },
      },
      project: {
        select: {
          id: true,
          slug: true,
          isPublished: true,
        },
      },
    },
  });

  if (!comment || !comment.project.isPublished) {
    return { error: tErrors("commentNotFound") };
  }

  if (comment.project.slug !== parsed.data.projectSlug) {
    return { error: tErrors("commentNotFound") };
  }

  if (
    !canManageComment(
      { id: session.user.id, role: session.user.role },
      comment.userId,
    )
  ) {
    return { forbidden: true, error: tErrors("commentForbidden") };
  }

  const nextPublicIds = new Set(uploadedImages.map((image) => image.publicId));
  const removedPublicIds = comment.images
    .map((image) => image.publicId)
    .filter((publicId): publicId is string => Boolean(publicId))
    .filter((publicId) => !nextPublicIds.has(publicId));

  await prisma.$transaction(async (tx) => {
    await tx.comment.update({
      where: { id: comment.id },
      data: {
        rating: parsed.data.rating,
        title: parsed.data.title,
        content: parsed.data.content,
      },
    });

    await tx.commentImage.deleteMany({
      where: { commentId: comment.id },
    });

    if (uploadedImages.length > 0) {
      await tx.commentImage.createMany({
        data: uploadedImages.map((image) => ({
          commentId: comment.id,
          imageUrl: image.url,
          publicId: image.publicId ?? null,
        })),
      });
    }
  });

  if (removedPublicIds.length > 0) {
    await deleteUploadedImages(removedPublicIds);
  }

  await revalidateProjectDetail(comment.project.slug);
  await revalidateProfilePage();

  return {
    success: true,
    ...(await buildRatingResult(comment.project.id)),
  };
}

export async function deleteComment(
  _prevState: CommentActionState,
  formData: FormData,
): Promise<CommentActionState> {
  const session = await auth();
  const tErrors = await getTranslations("Errors");
  const tValidation = await getTranslations("Validation");

  if (!session?.user?.id) {
    return { error: tErrors("mustBeSignedInToComment") };
  }

  const raw = {
    commentId: formData.get("commentId"),
    projectSlug: formData.get("projectSlug"),
  };

  const deleteSchema = createDeleteCommentSchema((key) => tValidation(key));
  const parsed = deleteSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const comment = await prisma.comment.findUnique({
    where: { id: parsed.data.commentId },
    select: {
      id: true,
      userId: true,
      images: {
        select: { publicId: true },
      },
      project: {
        select: {
          id: true,
          slug: true,
          isPublished: true,
        },
      },
    },
  });

  if (!comment || !comment.project.isPublished) {
    return { error: tErrors("commentNotFound") };
  }

  if (comment.project.slug !== parsed.data.projectSlug) {
    return { error: tErrors("commentNotFound") };
  }

  if (
    !canManageComment(
      { id: session.user.id, role: session.user.role },
      comment.userId,
    )
  ) {
    return { forbidden: true, error: tErrors("commentForbidden") };
  }

  const publicIds = comment.images
    .map((image) => image.publicId)
    .filter((publicId): publicId is string => Boolean(publicId));

  await prisma.$transaction(async (tx) => {
    await tx.commentImage.deleteMany({
      where: { commentId: comment.id },
    });

    await tx.comment.delete({
      where: { id: comment.id },
    });
  });

  if (publicIds.length > 0) {
    await deleteUploadedImages(publicIds);
  }

  await revalidateProjectDetail(comment.project.slug);
  await revalidateProfilePage();

  return {
    success: true,
    ...(await buildRatingResult(comment.project.id)),
  };
}
