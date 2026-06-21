import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { RestaurantAdminForm } from "@/components/admin/restaurant-admin-form";
import { PageHeader } from "@/components/layout/page-shell";
import {
  getAdminRestaurantForEdit,
  listAdminCategoryOptions,
} from "@/lib/data/admin-restaurants.server";

type EditRestaurantPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: EditRestaurantPageProps): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = await getAdminRestaurantForEdit(slug);
  const t = await getTranslations("AdminRestaurantForm");

  return {
    title: restaurant ? t("editPageTitle", { name: restaurant.name }) : t("notFound"),
  };
}

export default async function EditRestaurantPage({ params }: EditRestaurantPageProps) {
  const { slug } = await params;
  const [restaurant, categories, t] = await Promise.all([
    getAdminRestaurantForEdit(slug),
    listAdminCategoryOptions(),
    getTranslations("AdminRestaurantForm"),
  ]);

  if (!restaurant) {
    notFound();
  }

  const initialMainImage = restaurant.mainImageUrl
    ? {
        url: restaurant.mainImageUrl,
        publicId: restaurant.mainImagePublicId ?? undefined,
      }
    : null;

  const initialGalleryImages = restaurant.images.map((image) => ({
    id: image.id,
    url: image.imageUrl,
    publicId: image.publicId ?? undefined,
  }));

  return (
    <section className="space-y-6">
      <PageHeader
        title={t("editPageTitle", { name: restaurant.name })}
        subtitle={t("editPageSubtitle")}
      />
      <RestaurantAdminForm
        mode="edit"
        categories={categories}
        initialValues={{
          restaurantId: restaurant.id,
          slug: restaurant.slug,
          name: restaurant.name,
          descriptionUz: restaurant.descriptionUz,
          descriptionEn: restaurant.descriptionEn,
          descriptionRu: restaurant.descriptionRu,
          descriptionJa: restaurant.descriptionJa,
          address: restaurant.address,
          city: restaurant.city,
          phone: restaurant.phone ?? "",
          website: restaurant.website ?? "",
          openingHours: restaurant.openingHours ?? "",
          latitude: restaurant.latitude,
          longitude: restaurant.longitude,
          priceLevel: restaurant.priceLevel ?? undefined,
          cuisineType: restaurant.cuisineType ?? "",
          categoryId: restaurant.categoryId,
          isPublished: restaurant.isPublished,
        }}
        initialMainImage={initialMainImage}
        initialGalleryImages={initialGalleryImages}
      />
    </section>
  );
}
