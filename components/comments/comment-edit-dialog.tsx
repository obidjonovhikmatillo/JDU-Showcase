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
  Dialog,
  DialogBackdrop,
  DialogDescription,
  DialogPopup,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@/i18n/navigation";
import { updateComment } from "@/lib/actions/comment";
import type { SerializedCommentRecord } from "@/lib/comments/comment-serialization";
import { MAX_COMMENT_IMAGES } from "@/lib/uploads/image-upload-constants";
import type { ExistingUploadedImage } from "@/lib/uploads/image-upload-types";
import {
  createUpdateCommentSchema,
  type UpdateCommentInput,
} from "@/lib/validations/create-comment-schema";

type CommentEditDialogProps = {
  comment: SerializedCommentRecord;
  projectSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CommentEditDialog({
  comment,
  projectSlug,
  open,
  onOpenChange,
}: CommentEditDialogProps) {
  const router = useRouter();
  const [images, setImages] = useState<ExistingUploadedImage[]>(
    comment.images.map((image) => ({
      id: image.id,
      url: image.imageUrl,
      publicId: image.publicId ?? undefined,
    })),
  );
  const [serverError, setServerError] = useState<string | null>(null);
  const t = useTranslations("CommentEdit");
  const tValidation = useTranslations("Validation");
  const tToast = useTranslations("Toast");

  const updateSchema = useMemo(
    () => createUpdateCommentSchema((key) => tValidation(key)),
    [tValidation],
  );

  const form = useForm<UpdateCommentInput>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      commentId: comment.id,
      projectSlug,
      rating: comment.rating,
      title: comment.title,
      content: comment.content,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      form.reset({
        commentId: comment.id,
        projectSlug,
        rating: comment.rating,
        title: comment.title,
        content: comment.content,
      });
      setImages(
        comment.images.map((image) => ({
          id: image.id,
          url: image.imageUrl,
          publicId: image.publicId ?? undefined,
        })),
      );
    } else {
      setServerError(null);
    }

    onOpenChange(nextOpen);
  }

  async function onSubmit(values: UpdateCommentInput) {
    setServerError(null);

    const formData = new FormData();
    formData.set("commentId", values.commentId);
    formData.set("projectSlug", values.projectSlug);
    formData.set("rating", String(values.rating));
    formData.set("title", values.title);
    formData.set("content", values.content);
    formData.set("images", JSON.stringify(images));

    const result = await updateComment({}, formData);

    if (result.fieldErrors) {
      for (const [field, messages] of Object.entries(result.fieldErrors)) {
        if (messages?.[0]) {
          form.setError(field as keyof UpdateCommentInput, { message: messages[0] });
        }
      }
      toast.error(tToast("fixFields"));
      return;
    }

    if (result.forbidden) {
      setServerError(result.error ?? tToast("commentForbidden"));
      toast.error(result.error ?? tToast("commentForbidden"));
      return;
    }

    if (result.error) {
      setServerError(result.error);
      toast.error(result.error);
      return;
    }

    toast.success(tToast("commentUpdated"));
    handleOpenChange(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPopup>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription className="mt-2">{t("description")}</DialogDescription>

          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-5">
            <input type="hidden" {...form.register("commentId")} />
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
                <FieldLabel htmlFor={`edit-title-${comment.id}`}>{t("titleLabel")}</FieldLabel>
                <Input
                  id={`edit-title-${comment.id}`}
                  autoComplete="off"
                  disabled={isSubmitting}
                  aria-invalid={!!form.formState.errors.title}
                  {...form.register("title")}
                />
                <FieldError errors={[form.formState.errors.title]} />
              </Field>

              <Field data-invalid={!!form.formState.errors.content}>
                <FieldLabel htmlFor={`edit-content-${comment.id}`}>
                  {t("contentLabel")}
                </FieldLabel>
                <Textarea
                  id={`edit-content-${comment.id}`}
                  disabled={isSubmitting}
                  aria-invalid={!!form.formState.errors.content}
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

            <div className="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => handleOpenChange(false)}
              >
                {t("cancel")}
              </Button>
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
            </div>
          </form>
        </DialogPopup>
      </DialogPortal>
    </Dialog>
  );
}
