"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import { createRestaurant, updateRestaurant } from "@/lib/actions/admin-restaurant";
import { updateRestaurantImages } from "@/lib/actions/restaurant";
import { slugify } from "@/lib/admin/slugify";
import { MAX_RESTAURANT_GALLERY_IMAGES } from "@/lib/uploads/image-upload-constants";
import type { ExistingUploadedImage } from "@/lib/uploads/image-upload-types";
import {
  createAdminRestaurantFormSchema,
  type AdminRestaurantFormInput,
} from "@/lib/validations/admin-restaurant-schema";

type CategoryOption = {
  id: string;
  nameEn: string;
};

type RestaurantAdminFormProps = {
  mode: "create" | "edit";
  categories: CategoryOption[];
  initialValues?: Partial<AdminRestaurantFormInput> & {
    restaurantId?: string;
    slug?: string;
    descriptionUz?: string;
    descriptionEn?: string;
    descriptionRu?: string;
    descriptionJa?: string;
  };
  initialMainImage?: ExistingUploadedImage | null;
  initialGalleryImages?: ExistingUploadedImage[];
};

function pickInitialDescription(
  initialValues?: RestaurantAdminFormProps["initialValues"],
) {
  return (
    initialValues?.descriptionEn?.trim() ||
    initialValues?.descriptionUz?.trim() ||
    initialValues?.descriptionRu?.trim() ||
    initialValues?.descriptionJa?.trim() ||
    ""
  );
}

export function RestaurantAdminForm({
  mode,
  categories,
  initialValues,
  initialMainImage = null,
  initialGalleryImages = [],
}: RestaurantAdminFormProps) {
  const router = useRouter();
  const [mainImage, setMainImage] = useState<ExistingUploadedImage | null>(initialMainImage);
  const [galleryImages, setGalleryImages] =
    useState<ExistingUploadedImage[]>(initialGalleryImages);
  const [serverError, setServerError] = useState<string | null>(null);
  const t = useTranslations("AdminRestaurantForm");
  const tValidation = useTranslations("Validation");
  const tToast = useTranslations("Toast");

  const schema = useMemo(
    () => createAdminRestaurantFormSchema((key) => tValidation(key)),
    [tValidation],
  );

  const form = useForm<AdminRestaurantFormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialValues?.name ?? "",
      slug: initialValues?.slug ?? "",
      description: pickInitialDescription(initialValues),
      address: initialValues?.address ?? "",
      city: initialValues?.city ?? "Tashkent",
      phone: initialValues?.phone ?? "",
      website: initialValues?.website ?? "",
      openingHours: initialValues?.openingHours ?? "",
      latitude: initialValues?.latitude ?? 41.2995,
      longitude: initialValues?.longitude ?? 69.2401,
      priceLevel: initialValues?.priceLevel ?? undefined,
      cuisineType: initialValues?.cuisineType ?? "",
      categoryId: initialValues?.categoryId ?? categories[0]?.id ?? "",
      isPublished: initialValues?.isPublished ?? false,
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const selectedCategoryId = form.watch("categoryId");
  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId,
  );

  function applyFieldErrors(fieldErrors: Record<string, string[]>) {
    let firstField: keyof AdminRestaurantFormInput | null = null;

    for (const [key, messages] of Object.entries(fieldErrors)) {
      const message = messages?.[0];
      if (!message) continue;

      form.setError(key as keyof AdminRestaurantFormInput, { message });

      if (!firstField) {
        firstField = key as keyof AdminRestaurantFormInput;
      }
    }

    if (firstField) {
      const element = document.getElementById(String(firstField));
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      element?.focus();
    }
  }

  async function onSubmit(values: AdminRestaurantFormInput) {
    setServerError(null);

    const formData = new FormData();
    if (mode === "edit" && initialValues?.restaurantId) {
      formData.set("restaurantId", initialValues.restaurantId);
    }

    for (const [key, value] of Object.entries(values)) {
      if (typeof value === "boolean") {
        formData.set(key, String(value));
      } else if (value !== undefined && value !== null) {
        formData.set(key, String(value));
      }
    }

    const result =
      mode === "create"
        ? await createRestaurant({}, formData)
        : await updateRestaurant({}, formData);

    if (result.forbidden || result.error) {
      setServerError(result.error ?? tToast("reviewForbidden"));
      toast.error(result.error ?? tToast("reviewForbidden"));
      return;
    }

    if (result.fieldErrors) {
      applyFieldErrors(result.fieldErrors);
      toast.error(tToast("fixFields"));
      return;
    }

    const slug = result.slug ?? values.slug;

    if (mode === "edit" && slug) {
      const imageFormData = new FormData();
      imageFormData.set("restaurantSlug", slug);
      imageFormData.set("mainImage", mainImage ? JSON.stringify(mainImage) : "");
      imageFormData.set("galleryImages", JSON.stringify(galleryImages));
      const imageResult = await updateRestaurantImages({}, imageFormData);

      if (imageResult.error) {
        setServerError(imageResult.error);
        toast.error(imageResult.error);
        return;
      }
    }

    toast.success(mode === "create" ? tToast("restaurantCreated") : tToast("restaurantUpdated"));
    router.push(`/admin/restaurants/${slug}/edit`);
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {serverError ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {serverError}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>{t("basicsTitle")}</CardTitle>
          <CardDescription>{t("basicsDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="grid gap-4 md:grid-cols-2">
            <Field data-invalid={Boolean(form.formState.errors.name) || undefined}>
              <FieldLabel htmlFor="name">{t("name")}</FieldLabel>
              <Input
                id="name"
                aria-invalid={Boolean(form.formState.errors.name)}
                {...form.register("name")}
                disabled={isSubmitting}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>
            <Field data-invalid={Boolean(form.formState.errors.slug) || undefined}>
              <FieldLabel htmlFor="slug">{t("slug")}</FieldLabel>
              <Input
                id="slug"
                aria-invalid={Boolean(form.formState.errors.slug)}
                {...form.register("slug", {
                  onBlur: (event) => {
                    if (!event.target.value.trim()) {
                      form.setValue("slug", slugify(form.getValues("name")));
                    }
                  },
                })}
                disabled={isSubmitting}
              />
              <FieldError errors={[form.formState.errors.slug]} />
            </Field>
            <Field
              className="md:col-span-2"
              data-invalid={Boolean(form.formState.errors.categoryId) || undefined}
            >
              <FieldLabel>{t("category")}</FieldLabel>
              <Controller
                control={form.control}
                name="categoryId"
                render={({ field, fieldState }) => (
                  <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                    <SelectTrigger className="w-full" aria-invalid={Boolean(fieldState.error)}>
                      <span className="truncate text-sm">
                        {selectedCategory?.nameEn ?? t("categoryPlaceholder")}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.nameEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[form.formState.errors.categoryId]} />
            </Field>
            <Field data-invalid={Boolean(form.formState.errors.city) || undefined}>
              <FieldLabel htmlFor="city">{t("city")}</FieldLabel>
              <Input
                id="city"
                aria-invalid={Boolean(form.formState.errors.city)}
                {...form.register("city")}
                disabled={isSubmitting}
              />
              <FieldError errors={[form.formState.errors.city]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="cuisineType">{t("cuisineType")}</FieldLabel>
              <Input id="cuisineType" {...form.register("cuisineType")} disabled={isSubmitting} />
            </Field>
            <Field
              className="md:col-span-2"
              data-invalid={Boolean(form.formState.errors.address) || undefined}
            >
              <FieldLabel htmlFor="address">{t("address")}</FieldLabel>
              <Input
                id="address"
                aria-invalid={Boolean(form.formState.errors.address)}
                {...form.register("address")}
                disabled={isSubmitting}
              />
              <FieldError errors={[form.formState.errors.address]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="phone">{t("phone")}</FieldLabel>
              <Input id="phone" {...form.register("phone")} disabled={isSubmitting} />
            </Field>
            <Field data-invalid={Boolean(form.formState.errors.website) || undefined}>
              <FieldLabel htmlFor="website">{t("website")}</FieldLabel>
              <Input
                id="website"
                aria-invalid={Boolean(form.formState.errors.website)}
                {...form.register("website")}
                disabled={isSubmitting}
              />
              <FieldError errors={[form.formState.errors.website]} />
            </Field>
            <Field className="md:col-span-2">
              <FieldLabel htmlFor="openingHours">{t("openingHours")}</FieldLabel>
              <Input id="openingHours" {...form.register("openingHours")} disabled={isSubmitting} />
            </Field>
            <Field data-invalid={Boolean(form.formState.errors.latitude) || undefined}>
              <FieldLabel htmlFor="latitude">{t("latitude")}</FieldLabel>
              <Input
                id="latitude"
                type="number"
                step="any"
                aria-invalid={Boolean(form.formState.errors.latitude)}
                {...form.register("latitude", { valueAsNumber: true })}
                disabled={isSubmitting}
              />
              <FieldError errors={[form.formState.errors.latitude]} />
            </Field>
            <Field data-invalid={Boolean(form.formState.errors.longitude) || undefined}>
              <FieldLabel htmlFor="longitude">{t("longitude")}</FieldLabel>
              <Input
                id="longitude"
                type="number"
                step="any"
                aria-invalid={Boolean(form.formState.errors.longitude)}
                {...form.register("longitude", { valueAsNumber: true })}
                disabled={isSubmitting}
              />
              <FieldError errors={[form.formState.errors.longitude]} />
            </Field>
            <Field data-invalid={Boolean(form.formState.errors.priceLevel) || undefined}>
              <FieldLabel htmlFor="priceLevel">{t("priceLevel")}</FieldLabel>
              <Input
                id="priceLevel"
                type="number"
                min={1}
                max={4}
                aria-invalid={Boolean(form.formState.errors.priceLevel)}
                {...form.register("priceLevel", {
                  setValueAs: (value) =>
                    value === "" || Number.isNaN(Number(value)) ? undefined : Number(value),
                })}
                disabled={isSubmitting}
              />
              <FieldError errors={[form.formState.errors.priceLevel]} />
            </Field>
            <Field className="flex items-end">
              <Controller
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                      disabled={isSubmitting}
                    />
                    {t("published")}
                  </label>
                )}
              />
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("descriptionsTitle")}</CardTitle>
          <CardDescription>{t("descriptionsDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Field data-invalid={Boolean(form.formState.errors.description) || undefined}>
            <FieldLabel htmlFor="description">{t("description")}</FieldLabel>
            <Textarea
              id="description"
              rows={5}
              aria-invalid={Boolean(form.formState.errors.description)}
              {...form.register("description")}
              disabled={isSubmitting}
            />
            <FieldError errors={[form.formState.errors.description]} />
          </Field>
        </CardContent>
      </Card>

      {mode === "edit" ? (
        <Card>
          <CardHeader>
            <CardTitle>{t("imagesTitle")}</CardTitle>
            <CardDescription>{t("imagesDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <ImageUpload
              label={t("mainImage")}
              folderKey="restaurantMain"
              maxImages={1}
              multiple={false}
              disabled={isSubmitting}
              value={mainImage ? [mainImage] : []}
              onChange={(images) => setMainImage(images[0] ?? null)}
            />
            <ImageUpload
              label={t("galleryImages")}
              folderKey="restaurantGallery"
              maxImages={MAX_RESTAURANT_GALLERY_IMAGES}
              disabled={isSubmitting}
              value={galleryImages}
              onChange={setGalleryImages}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">{t("imagesAfterCreate")}</CardContent>
        </Card>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2Icon className="size-4 animate-spin" aria-hidden />
            {t("saving")}
          </>
        ) : mode === "create" ? (
          t("create")
        ) : (
          t("save")
        )}
      </Button>
    </form>
  );
}
