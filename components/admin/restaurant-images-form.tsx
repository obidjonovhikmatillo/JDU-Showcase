"use client";

import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { ImageUpload } from "@/components/uploads/image-upload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateRestaurantImages } from "@/lib/actions/restaurant";
import { MAX_RESTAURANT_GALLERY_IMAGES } from "@/lib/uploads/image-upload-constants";
import type { ExistingUploadedImage } from "@/lib/uploads/image-upload-types";

type RestaurantImagesFormProps = {
  restaurantSlug: string;
  initialMainImage: ExistingUploadedImage | null;
  initialGalleryImages: ExistingUploadedImage[];
};

export function RestaurantImagesForm({
  restaurantSlug,
  initialMainImage,
  initialGalleryImages,
}: RestaurantImagesFormProps) {
  const [mainImage, setMainImage] = useState<ExistingUploadedImage | null>(
    initialMainImage,
  );
  const [galleryImages, setGalleryImages] =
    useState<ExistingUploadedImage[]>(initialGalleryImages);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const t = useTranslations("AdminRestaurantImages");
  const tToast = useTranslations("Toast");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setServerError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.set("restaurantSlug", restaurantSlug);
    formData.set("mainImage", mainImage ? JSON.stringify(mainImage) : "");
    formData.set("galleryImages", JSON.stringify(galleryImages));

    const result = await updateRestaurantImages({}, formData);
    setIsSubmitting(false);

    if (result.forbidden) {
      setServerError(result.error ?? tToast("reviewForbidden"));
      toast.error(result.error ?? tToast("reviewForbidden"));
      return;
    }

    if (result.error) {
      setServerError(result.error);
      toast.error(result.error);
      return;
    }

    toast.success(tToast("restaurantImagesUpdated"));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {serverError ? (
            <div
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {serverError}
            </div>
          ) : null}

          <ImageUpload
            label={t("mainImageLabel")}
            description={t("mainImageDescription")}
            folderKey="restaurantMain"
            maxImages={1}
            multiple={false}
            disabled={isSubmitting}
            value={mainImage ? [mainImage] : []}
            onChange={(images) => setMainImage(images[0] ?? null)}
          />

          <ImageUpload
            label={t("galleryLabel")}
            description={t("galleryDescription")}
            folderKey="restaurantGallery"
            maxImages={MAX_RESTAURANT_GALLERY_IMAGES}
            disabled={isSubmitting}
            value={galleryImages}
            onChange={setGalleryImages}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2Icon className="size-4 animate-spin" aria-hidden />
                {t("saving")}
              </>
            ) : (
              t("save")
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
