"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { RatingInput } from "@/components/comments/rating-input";
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
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import { createComment } from "@/lib/actions/comment";
import { MAX_COMMENT_IMAGES } from "@/lib/uploads/image-upload-constants";
import type { ExistingUploadedImage } from "@/lib/uploads/image-upload-types";
import {
  createCommentSchema,
  type CommentFormValues,
} from "@/lib/validations/create-comment-schema";

type CommentFormProps = {
  projectSlug: string;
};

export function CommentForm({ projectSlug }: CommentFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<ExistingUploadedImage[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const t = useTranslations("CommentForm");
  const tValidation = useTranslations("Validation");
  const tToast = useTranslations("Toast");

  const commentSchema = useMemo(
    () => createCommentSchema((key) => tValidation(key)),
    [tValidation],
  );

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      projectSlug,
      rating: 0,
      title: "",
      content: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: CommentFormValues) {
    setServerError(null);

    const formData = new FormData();
    formData.set("projectSlug", values.projectSlug);
    formData.set("rating", String(values.rating));
    formData.set("title", values.title);
    formData.set("content", values.content);
    formData.set("images", JSON.stringify(images));

    const result = await createComment({}, formData);

    if (result.fieldErrors) {
      for (const [field, messages] of Object.entries(result.fieldErrors)) {
        if (messages?.[0]) {
          form.setError(field as keyof CommentFormValues, { message: messages[0] });
        }
      }
      toast.error(tToast("fixFields"));
      return;
    }

    if (result.error) {
      setServerError(result.error);
      toast.error(result.error);
      return;
    }

    form.reset({
      projectSlug,
      rating: 0,
      title: "",
      content: "",
    });
    setImages([]);

    toast.success(tToast("commentCreated"));
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <input type="hidden" {...form.register("projectSlug")} />

          {serverError ? (
            <div
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {serverError}
            </div>
          ) : null}

          <FieldGroup>
            <Field data-invalid={!!form.formState.errors.rating}>
              <FieldLabel>{t("ratingLabel")}</FieldLabel>
              <Controller
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <RatingInput
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                    invalid={!!form.formState.errors.rating}
                  />
                )}
              />
              <FieldError errors={[form.formState.errors.rating]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.title}>
              <FieldLabel htmlFor="comment-title">{t("titleLabel")}</FieldLabel>
              <Input
                id="comment-title"
                autoComplete="off"
                aria-invalid={!!form.formState.errors.title}
                disabled={isSubmitting}
                {...form.register("title")}
              />
              <FieldError errors={[form.formState.errors.title]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.content}>
              <FieldLabel htmlFor="comment-content">{t("contentLabel")}</FieldLabel>
              <Textarea
                id="comment-content"
                aria-invalid={!!form.formState.errors.content}
                disabled={isSubmitting}
                {...form.register("content")}
              />
              <FieldError errors={[form.formState.errors.content]} />
            </Field>

            <Field>
              <ImageUpload
                label={t("imagesLabel")}
                description={t("imagesDescription")}
                folderKey="comment"
                maxImages={MAX_COMMENT_IMAGES}
                disabled={isSubmitting}
                value={images}
                onChange={setImages}
              />
            </Field>
          </FieldGroup>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2Icon className="size-4 animate-spin" aria-hidden />
                {t("submitting")}
              </>
            ) : (
              t("submit")
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
