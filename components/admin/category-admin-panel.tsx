"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, PencilIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/navigation";
import { createCategory, deleteCategory, updateCategory } from "@/lib/actions/admin-category";
import { slugify } from "@/lib/admin/slugify";
import {
  createAdminCategorySchema,
  type AdminCategoryInput,
} from "@/lib/validations/admin-category-schema";

type CategoryItem = {
  id: string;
  slug: string;
  nameUz: string;
  nameEn: string;
  nameRu: string;
  nameJa: string;
  _count: { restaurants: number };
};

type CategoryAdminPanelProps = {
  categories: CategoryItem[];
};

export function CategoryAdminPanel({ categories }: CategoryAdminPanelProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const t = useTranslations("AdminCategories");
  const tValidation = useTranslations("Validation");
  const tToast = useTranslations("Toast");

  const schema = useMemo(
    () => createAdminCategorySchema((key) => tValidation(key)),
    [tValidation],
  );

  const form = useForm<AdminCategoryInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      nameUz: "",
      nameEn: "",
      nameRu: "",
      nameJa: "",
      slug: "",
    },
  });

  function startEdit(category: CategoryItem) {
    setEditingId(category.id);
    form.reset({
      nameUz: category.nameUz,
      nameEn: category.nameEn,
      nameRu: category.nameRu,
      nameJa: category.nameJa,
      slug: category.slug,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    form.reset({
      nameUz: "",
      nameEn: "",
      nameRu: "",
      nameJa: "",
      slug: "",
    });
  }

  async function onSubmit(values: AdminCategoryInput) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(values)) {
      formData.set(key, value);
    }

    const result = editingId
      ? await updateCategory({}, (() => {
          formData.set("categoryId", editingId);
          return formData;
        })())
      : await createCategory({}, formData);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(editingId ? tToast("categoryUpdated") : tToast("categoryCreated"));
    cancelEdit();
    router.refresh();
  }

  async function handleDelete(categoryId: string) {
    const formData = new FormData();
    formData.set("categoryId", categoryId);
    const result = await deleteCategory({}, formData);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(tToast("categoryDeleted"));
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? t("editTitle") : t("createTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup className="grid gap-4 md:grid-cols-2">
              {(["nameUz", "nameEn", "nameRu", "nameJa"] as const).map((fieldName) => (
                <Field key={fieldName}>
                  <FieldLabel htmlFor={fieldName}>{t(fieldName)}</FieldLabel>
                  <Input
                    id={fieldName}
                    {...form.register(fieldName, {
                      onBlur:
                        fieldName === "nameEn" && !form.getValues("slug")
                          ? () => form.setValue("slug", slugify(form.getValues("nameEn")))
                          : undefined,
                    })}
                  />
                  <FieldError errors={[form.formState.errors[fieldName]]} />
                </Field>
              ))}
              <Field className="md:col-span-2">
                <FieldLabel htmlFor="slug">{t("slug")}</FieldLabel>
                <Input id="slug" {...form.register("slug")} />
                <FieldError errors={[form.formState.errors.slug]} />
              </Field>
            </FieldGroup>
            <div className="flex gap-2">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" aria-hidden />
                    {t("saving")}
                  </>
                ) : editingId ? (
                  t("save")
                ) : (
                  t("create")
                )}
              </Button>
              {editingId ? (
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  {t("cancel")}
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      {categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      ) : (
        <div className="space-y-3">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{category.nameEn}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("meta", {
                      slug: category.slug,
                      count: category._count.restaurants,
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" size="sm" variant="outline" onClick={() => startEdit(category)}>
                    <PencilIcon className="size-4" aria-hidden />
                    {t("edit")}
                  </Button>
                  <AdminConfirmDialog
                    title={t("deleteTitle")}
                    description={t("deleteDescription")}
                    confirmLabel={t("deleteConfirm")}
                    triggerLabel={t("delete")}
                    disabled={category._count.restaurants > 0}
                    onConfirm={() => handleDelete(category.id)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
