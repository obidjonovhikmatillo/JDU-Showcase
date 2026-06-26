"use server";

import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";

export async function revalidateAdminPaths() {
  const locale = await getLocale();
  revalidatePath(`/${locale}/admin`);
  revalidatePath(`/${locale}/admin/projects`);
  revalidatePath(`/${locale}/admin/categories`);
  revalidatePath(`/${locale}/admin/comments`);
  revalidatePath(`/${locale}/admin/users`);
}

export async function revalidateProjectPaths(slug: string) {
  const locale = await getLocale();
  revalidatePath(`/${locale}/projects`);
  revalidatePath(`/${locale}/projects/${slug}`);
  revalidatePath(`/${locale}/admin/projects`);
  revalidatePath(`/${locale}/admin/projects/${slug}/edit`);
  revalidatePath(`/${locale}/admin`);
}
