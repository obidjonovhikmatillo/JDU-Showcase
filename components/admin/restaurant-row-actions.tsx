"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { deleteRestaurant, toggleRestaurantPublished } from "@/lib/actions/admin-restaurant";
import { cn } from "@/lib/utils";

type RestaurantRowActionsProps = {
  restaurantId: string;
  slug: string;
  isPublished: boolean;
};

export function RestaurantRowActions({
  restaurantId,
  slug,
  isPublished,
}: RestaurantRowActionsProps) {
  const router = useRouter();
  const t = useTranslations("AdminRestaurants");
  const tToast = useTranslations("Toast");

  async function handleTogglePublish() {
    const formData = new FormData();
    formData.set("restaurantId", restaurantId);
    formData.set("isPublished", String(!isPublished));
    const result = await toggleRestaurantPublished(formData);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(
      !isPublished ? tToast("restaurantPublished") : tToast("restaurantUnpublished"),
    );
    router.refresh();
  }

  async function handleDelete() {
    const formData = new FormData();
    formData.set("restaurantId", restaurantId);
    const result = await deleteRestaurant({}, formData);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(tToast("restaurantDeleted"));
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Link href={`/admin/restaurants/${slug}/edit`} className={cn(buttonVariants({ size: "sm" }))}>
        {t("edit")}
      </Link>
      <AdminConfirmDialog
        title={isPublished ? t("unpublishTitle") : t("publishTitle")}
        description={isPublished ? t("unpublishDescription") : t("publishDescription")}
        confirmLabel={isPublished ? t("unpublish") : t("publish")}
        triggerLabel={isPublished ? t("unpublish") : t("publish")}
        triggerVariant="outline"
        onConfirm={handleTogglePublish}
      />
      <AdminConfirmDialog
        title={t("deleteTitle")}
        description={t("deleteDescription")}
        confirmLabel={t("deleteConfirm")}
        triggerLabel={t("delete")}
        onConfirm={handleDelete}
      />
    </div>
  );
}
