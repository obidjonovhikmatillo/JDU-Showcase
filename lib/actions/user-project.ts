"use server";

import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/admin/slugify";

export type UserProjectActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createUserProject(
  _prev: UserProjectActionState,
  formData: FormData,
): Promise<UserProjectActionState> {
  const session = await auth();
  const tErrors = await getTranslations("Errors");
  const tValidation = await getTranslations("Validation");

  if (!session?.user?.id) {
    return { error: tErrors("mustBeSignedIn") };
  }

  const schema = z.object({
    title: z.string().min(1, tValidation("projectNameRequired")),
    description: z.string().min(1, tValidation("descriptionRequired")),
    categoryId: z.string().min(1, tValidation("categoryRequired")),
    techStack: z.string().optional(),
    department: z.string().optional(),
    difficulty: z.string().optional(),
    mainImageUrl: z.string().optional(),
    isPublished: z.boolean(),
  });

  const raw = {
    title: formData.get("title") as string | null,
    description: formData.get("description") as string | null,
    categoryId: formData.get("categoryId") as string | null,
    techStack: (formData.get("techStack") as string | null) || undefined,
    department: (formData.get("department") as string | null) || undefined,
    difficulty: (formData.get("difficulty") as string | null) || undefined,
    mainImageUrl: (formData.get("mainImageUrl") as string | null) || undefined,
    isPublished: formData.get("isPublished") === "true",
  };

  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  // Generate slug from title
  let slug = slugify(parsed.data.title);
  if (!slug) {
    slug = `project-${Date.now()}`;
  }

  // Ensure slug is unique
  const slugExists = await prisma.project.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (slugExists) {
    slug = `${slug}-${Date.now()}`;
  }

  // Verify category exists
  const category = await prisma.category.findUnique({
    where: { id: parsed.data.categoryId },
    select: { id: true },
  });

  if (!category) {
    return { error: tValidation("categoryRequired") };
  }

  const description = parsed.data.description;
  const authorName = session.user.fullName || session.user.name || "Unknown";

  await prisma.project.create({
    data: {
      title: parsed.data.title,
      slug,
      descriptionUz: description,
      descriptionEn: description,
      descriptionRu: description,
      descriptionJa: description,
      authorName,
      department: parsed.data.department || "General",
      techStack: parsed.data.techStack || null,
      difficulty: parsed.data.difficulty || null,
      mainImageUrl: parsed.data.mainImageUrl || null,
      isPublished: parsed.data.isPublished,
      categoryId: parsed.data.categoryId,
      authorId: session.user.id,
    },
    select: { id: true },
  });

  revalidatePath("/", "layout");

  return { success: true };
}
