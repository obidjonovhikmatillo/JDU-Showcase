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
import { createProject, updateProject } from "@/lib/actions/admin-project";
import { updateProjectImages } from "@/lib/actions/project";
import { slugify } from "@/lib/admin/slugify";
import { MAX_PROJECT_GALLERY_IMAGES } from "@/lib/uploads/image-upload-constants";
import type { ExistingUploadedImage } from "@/lib/uploads/image-upload-types";
import {
  createAdminProjectFormSchema,
  type AdminProjectFormInput,
} from "@/lib/validations/admin-project-schema";

type CategoryOption = {
  id: string;
  nameEn: string;
};

type ProjectAdminFormProps = {
  mode: "create" | "edit";
  categories: CategoryOption[];
  initialValues?: Partial<AdminProjectFormInput> & {
    projectId?: string;
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
  initialValues?: ProjectAdminFormProps["initialValues"],
) {
  return (
    initialValues?.descriptionEn?.trim() ||
    initialValues?.descriptionUz?.trim() ||
    initialValues?.descriptionRu?.trim() ||
    initialValues?.descriptionJa?.trim() ||
    ""
  );
}

export function ProjectAdminForm({
  mode,
  categories,
  initialValues,
  initialMainImage = null,
  initialGalleryImages = [],
}: ProjectAdminFormProps) {
  const router = useRouter();
  const [mainImage, setMainImage] = useState<ExistingUploadedImage | null>(initialMainImage);
  const [galleryImages, setGalleryImages] =
    useState<ExistingUploadedImage[]>(initialGalleryImages);
  const [serverError, setServerError] = useState<string | null>(null);
  const t = useTranslations("AdminProjectForm");
  const tValidation = useTranslations("Validation");
  const tToast = useTranslations("Toast");

  const schema = useMemo(
    () => createAdminProjectFormSchema((key) => tValidation(key)),
    [tValidation],
  );

  const form = useForm<AdminProjectFormInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialValues?.title ?? "",
      slug: initialValues?.slug ?? "",
      description: pickInitialDescription(initialValues),
      authorName: initialValues?.authorName ?? "",
      department: initialValues?.department ?? "Computer Science",
      demoUrl: initialValues?.demoUrl ?? "",
      githubUrl: initialValues?.githubUrl ?? "",
      techStack: initialValues?.techStack ?? "",
      difficulty: initialValues?.difficulty ?? "",
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
    let firstField: keyof AdminProjectFormInput | null = null;

    for (const [key, messages] of Object.entries(fieldErrors)) {
      const message = messages?.[0];
      if (!message) continue;

      form.setError(key as keyof AdminProjectFormInput, { message });

      if (!firstField) {
        firstField = key as keyof AdminProjectFormInput;
      }
    }

    if (firstField) {
      const element = document.getElementById(String(firstField));
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      element?.focus();
    }
  }

  async function onSubmit(values: AdminProjectFormInput) {
    setServerError(null);

    const formData = new FormData();
    if (mode === "edit" && initialValues?.projectId) {
      formData.set("projectId", initialValues.projectId);
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
        ? await createProject({}, formData)
        : await updateProject({}, formData);

    if (result.forbidden || result.error) {
      setServerError(result.error ?? tToast("commentForbidden"));
      toast.error(result.error ?? tToast("commentForbidden"));
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
      imageFormData.set("projectSlug", slug);
      imageFormData.set("mainImage", mainImage ? JSON.stringify(mainImage) : "");
      imageFormData.set("galleryImages", JSON.stringify(galleryImages));
      const imageResult = await updateProjectImages({}, imageFormData);

      if (imageResult.error) {
        setServerError(imageResult.error);
        toast.error(imageResult.error);
        return;
      }
    }

    toast.success(mode === "create" ? tToast("projectCreated") : tToast("projectUpdated"));
    router.push(`/admin/projects/${slug}/edit`);
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
            <Field data-invalid={Boolean(form.formState.errors.title) || undefined}>
              <FieldLabel htmlFor="title">{t("title")}</FieldLabel>
              <Input
                id="title"
                aria-invalid={Boolean(form.formState.errors.title)}
                {...form.register("title")}
                disabled={isSubmitting}
              />
              <FieldError errors={[form.formState.errors.title]} />
            </Field>
            <Field data-invalid={Boolean(form.formState.errors.slug) || undefined}>
              <FieldLabel htmlFor="slug">{t("slug")}</FieldLabel>
              <Input
                id="slug"
                aria-invalid={Boolean(form.formState.errors.slug)}
                {...form.register("slug", {
                  onBlur: (event) => {
                    if (!event.target.value.trim()) {
                      form.setValue("slug", slugify(form.getValues("title")));
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
            <Field data-invalid={Boolean(form.formState.errors.department) || undefined}>
              <FieldLabel htmlFor="department">{t("department")}</FieldLabel>
              <Input
                id="department"
                aria-invalid={Boolean(form.formState.errors.department)}
                {...form.register("department")}
                disabled={isSubmitting}
              />
              <FieldError errors={[form.formState.errors.department]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="techStack">{t("techStack")}</FieldLabel>
              <Input id="techStack" {...form.register("techStack")} disabled={isSubmitting} />
            </Field>
            <Field
              className="md:col-span-2"
              data-invalid={Boolean(form.formState.errors.authorName) || undefined}
            >
              <FieldLabel htmlFor="authorName">{t("authorName")}</FieldLabel>
              <Input
                id="authorName"
                aria-invalid={Boolean(form.formState.errors.authorName)}
                {...form.register("authorName")}
                disabled={isSubmitting}
              />
              <FieldError errors={[form.formState.errors.authorName]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="demoUrl">{t("demoUrl")}</FieldLabel>
              <Input id="demoUrl" {...form.register("demoUrl")} disabled={isSubmitting} />
            </Field>
            <Field>
              <FieldLabel htmlFor="githubUrl">{t("githubUrl")}</FieldLabel>
              <Input id="githubUrl" {...form.register("githubUrl")} disabled={isSubmitting} />
            </Field>
            <Field>
              <FieldLabel htmlFor="difficulty">{t("difficulty")}</FieldLabel>
              <Input id="difficulty" {...form.register("difficulty")} disabled={isSubmitting} />
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
              folderKey="projectMain"
              maxImages={1}
              multiple={false}
              disabled={isSubmitting}
              value={mainImage ? [mainImage] : []}
              onChange={(images) => setMainImage(images[0] ?? null)}
            />
            <ImageUpload
              label={t("galleryImages")}
              folderKey="projectGallery"
              maxImages={MAX_PROJECT_GALLERY_IMAGES}
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
