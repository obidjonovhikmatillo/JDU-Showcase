"use server";

import { getTranslations } from "next-intl/server";

import { revalidateAdminPaths } from "@/lib/admin/revalidate-admin-paths";
import { requireAdminAction } from "@/lib/admin/require-admin-action";
import { revalidateRestaurantPaths } from "@/lib/admin/revalidate-admin-paths";
import prisma from "@/lib/prisma";
import { deleteUploadedImages } from "@/lib/uploads/image-storage.server";
import {
  createAdminRestaurantDeleteSchema,
  createAdminRestaurantPublishSchema,
  createAdminRestaurantSchema,
  createAdminRestaurantUpdateSchema,
} from "@/lib/validations/admin-restaurant-schema";

export type AdminRestaurantActionState = {
  success?: boolean;
  error?: string;
  forbidden?: boolean;
  fieldErrors?: Record<string, string[]>;
  slug?: string;
};

function parseRestaurantFormData(formData: FormData) {
  const priceLevelRaw = formData.get("priceLevel");
  const priceLevel =
    typeof priceLevelRaw === "string" && priceLevelRaw.trim() !== ""
      ? Number(priceLevelRaw)
      : null;

  return {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    address: formData.get("address"),
    city: formData.get("city"),
    phone: formData.get("phone"),
    website: formData.get("website"),
    openingHours: formData.get("openingHours"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    priceLevel,
    cuisineType: formData.get("cuisineType"),
    categoryId: formData.get("categoryId"),
    isPublished: formData.get("isPublished") === "true" || formData.get("isPublished") === "on",
  };
}

function normalizeOptionalStrings<T extends Record<string, unknown>>(data: T) {
  const result = { ...data } as Record<string, unknown>;

  for (const key of ["phone", "website", "openingHours", "cuisineType"] as const) {
    if (typeof result[key] === "string" && (result[key] as string).trim() === "") {
      result[key] = undefined;
    }
  }

  return result;
}

export async function createRestaurant(
  _prev: AdminRestaurantActionState,
  formData: FormData,
): Promise<AdminRestaurantActionState> {
  const authResult = await requireAdminAction();
  const tValidation = await getTranslations("Validation");

  if (!authResult.ok) {
    return { forbidden: true, error: authResult.error };
  }

  const schema = createAdminRestaurantSchema((key) => tValidation(key));
  const parsed = schema.safeParse(normalizeOptionalStrings(parseRestaurantFormData(formData)));

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const slugExists = await prisma.restaurant.findUnique({
    where: { slug: parsed.data.slug },
    select: { id: true },
  });

  if (slugExists) {
    return { error: tValidation("restaurantSlugExists") };
  }

  const category = await prisma.category.findUnique({
    where: { id: parsed.data.categoryId },
    select: { id: true },
  });

  if (!category) {
    return { error: tValidation("categoryRequired") };
  }

  const restaurant = await prisma.restaurant.create({
    data: {
      ...parsed.data,
      phone: parsed.data.phone ?? null,
      website: parsed.data.website ?? null,
      openingHours: parsed.data.openingHours ?? null,
      cuisineType: parsed.data.cuisineType ?? null,
      priceLevel: parsed.data.priceLevel ?? null,
    },
    select: { slug: true },
  });

  await revalidateAdminPaths();
  await revalidateRestaurantPaths(restaurant.slug);

  return { success: true, slug: restaurant.slug };
}

export async function updateRestaurant(
  _prev: AdminRestaurantActionState,
  formData: FormData,
): Promise<AdminRestaurantActionState> {
  const authResult = await requireAdminAction();
  const tValidation = await getTranslations("Validation");
  const tErrors = await getTranslations("Errors");

  if (!authResult.ok) {
    return { forbidden: true, error: authResult.error };
  }

  const raw = {
    restaurantId: formData.get("restaurantId"),
    ...normalizeOptionalStrings(parseRestaurantFormData(formData)),
  };

  const schema = createAdminRestaurantUpdateSchema((key) => tValidation(key));
  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existing = await prisma.restaurant.findUnique({
    where: { id: parsed.data.restaurantId },
    select: { id: true, slug: true },
  });

  if (!existing) {
    return { error: tErrors("restaurantNotFound") };
  }

  const slugConflict = await prisma.restaurant.findFirst({
    where: {
      slug: parsed.data.slug,
      NOT: { id: parsed.data.restaurantId },
    },
    select: { id: true },
  });

  if (slugConflict) {
    return { error: tValidation("restaurantSlugExists") };
  }

  const restaurant = await prisma.restaurant.update({
    where: { id: parsed.data.restaurantId },
    data: {
      name: parsed.data.name,
      slug: parsed.data.slug,
      descriptionUz: parsed.data.descriptionUz,
      descriptionEn: parsed.data.descriptionEn,
      descriptionRu: parsed.data.descriptionRu,
      descriptionJa: parsed.data.descriptionJa,
      address: parsed.data.address,
      city: parsed.data.city,
      phone: parsed.data.phone ?? null,
      website: parsed.data.website ?? null,
      openingHours: parsed.data.openingHours ?? null,
      latitude: parsed.data.latitude,
      longitude: parsed.data.longitude,
      priceLevel: parsed.data.priceLevel ?? null,
      cuisineType: parsed.data.cuisineType ?? null,
      categoryId: parsed.data.categoryId,
      isPublished: parsed.data.isPublished,
    },
    select: { slug: true },
  });

  await revalidateAdminPaths();
  await revalidateRestaurantPaths(restaurant.slug);
  if (existing.slug !== restaurant.slug) {
    await revalidateRestaurantPaths(existing.slug);
  }

  return { success: true, slug: restaurant.slug };
}

export async function deleteRestaurant(
  _prev: AdminRestaurantActionState,
  formData: FormData,
): Promise<AdminRestaurantActionState> {
  const authResult = await requireAdminAction();
  const tValidation = await getTranslations("Validation");
  const tErrors = await getTranslations("Errors");

  if (!authResult.ok) {
    return { forbidden: true, error: authResult.error };
  }

  const schema = createAdminRestaurantDeleteSchema((key) => tValidation(key));
  const parsed = schema.safeParse({ restaurantId: formData.get("restaurantId") });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: { id: parsed.data.restaurantId },
    select: {
      slug: true,
      mainImagePublicId: true,
      images: { select: { publicId: true } },
    },
  });

  if (!restaurant) {
    return { error: tErrors("restaurantNotFound") };
  }

  const publicIds = [
    ...(restaurant.mainImagePublicId ? [restaurant.mainImagePublicId] : []),
    ...restaurant.images
      .map((image) => image.publicId)
      .filter((publicId): publicId is string => Boolean(publicId)),
  ];

  await prisma.restaurant.delete({ where: { id: parsed.data.restaurantId } });

  if (publicIds.length > 0) {
    await deleteUploadedImages(publicIds);
  }

  await revalidateAdminPaths();
  await revalidateRestaurantPaths(restaurant.slug);

  return { success: true };
}

export async function toggleRestaurantPublished(
  formData: FormData,
): Promise<AdminRestaurantActionState> {
  const authResult = await requireAdminAction();
  const tValidation = await getTranslations("Validation");
  const tErrors = await getTranslations("Errors");

  if (!authResult.ok) {
    return { forbidden: true, error: authResult.error };
  }

  const schema = createAdminRestaurantPublishSchema((key) => tValidation(key));
  const parsed = schema.safeParse({
    restaurantId: formData.get("restaurantId"),
    isPublished: formData.get("isPublished"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const restaurant = await prisma.restaurant.update({
    where: { id: parsed.data.restaurantId },
    data: { isPublished: parsed.data.isPublished },
    select: { slug: true },
  }).catch(() => null);

  if (!restaurant) {
    return { error: tErrors("restaurantNotFound") };
  }

  await revalidateAdminPaths();
  await revalidateRestaurantPaths(restaurant.slug);

  return { success: true, slug: restaurant.slug };
}
