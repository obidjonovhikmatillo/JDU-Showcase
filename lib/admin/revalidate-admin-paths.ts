"use server";

import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";

export async function revalidateAdminPaths() {
  const locale = await getLocale();
  revalidatePath(`/${locale}/admin`);
  revalidatePath(`/${locale}/admin/restaurants`);
  revalidatePath(`/${locale}/admin/categories`);
  revalidatePath(`/${locale}/admin/reviews`);
  revalidatePath(`/${locale}/admin/users`);
}

export async function revalidateRestaurantPaths(slug: string) {
  const locale = await getLocale();
  revalidatePath(`/${locale}/restaurants`);
  revalidatePath(`/${locale}/restaurants/${slug}`);
  revalidatePath(`/${locale}/admin/restaurants`);
  revalidatePath(`/${locale}/admin/restaurants/${slug}/edit`);
  revalidatePath(`/${locale}/admin`);
}
