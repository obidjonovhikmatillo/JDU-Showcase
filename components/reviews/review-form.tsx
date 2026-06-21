"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { RatingInput } from "@/components/reviews/rating-input";
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
import { createReview } from "@/lib/actions/review";
import { todayInputValue } from "@/lib/reviews/review-serialization";
import { MAX_REVIEW_IMAGES } from "@/lib/uploads/image-upload-constants";
import type { ExistingUploadedImage } from "@/lib/uploads/image-upload-types";
import {
  createReviewSchema,
  type ReviewFormValues,
} from "@/lib/validations/create-review-schema";

type ReviewFormProps = {
  restaurantSlug: string;
};

export function ReviewForm({ restaurantSlug }: ReviewFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<ExistingUploadedImage[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const t = useTranslations("ReviewForm");
  const tValidation = useTranslations("Validation");
  const tToast = useTranslations("Toast");

  const reviewSchema = useMemo(
    () => createReviewSchema((key) => tValidation(key)),
    [tValidation],
  );

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      restaurantSlug,
      rating: 0,
      title: "",
      content: "",
      visitDate: todayInputValue(),
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: ReviewFormValues) {
    setServerError(null);

    const formData = new FormData();
    formData.set("restaurantSlug", values.restaurantSlug);
    formData.set("rating", String(values.rating));
    formData.set("title", values.title);
    formData.set("content", values.content);
    formData.set("visitDate", values.visitDate);
    formData.set("images", JSON.stringify(images));

    const result = await createReview({}, formData);

    if (result.fieldErrors) {
      for (const [field, messages] of Object.entries(result.fieldErrors)) {
        if (messages?.[0]) {
          form.setError(field as keyof ReviewFormValues, { message: messages[0] });
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
      restaurantSlug,
      rating: 0,
      title: "",
      content: "",
      visitDate: todayInputValue(),
    });
    setImages([]);

    toast.success(tToast("reviewCreated"));
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
          <input type="hidden" {...form.register("restaurantSlug")} />

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
              <FieldLabel htmlFor="review-title">{t("titleLabel")}</FieldLabel>
              <Input
                id="review-title"
                autoComplete="off"
                aria-invalid={!!form.formState.errors.title}
                disabled={isSubmitting}
                {...form.register("title")}
              />
              <FieldError errors={[form.formState.errors.title]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.content}>
              <FieldLabel htmlFor="review-content">{t("contentLabel")}</FieldLabel>
              <Textarea
                id="review-content"
                aria-invalid={!!form.formState.errors.content}
                disabled={isSubmitting}
                {...form.register("content")}
              />
              <FieldError errors={[form.formState.errors.content]} />
            </Field>

            <Field data-invalid={!!form.formState.errors.visitDate}>
              <FieldLabel htmlFor="review-visit-date">{t("visitDateLabel")}</FieldLabel>
              <Input
                id="review-visit-date"
                type="date"
                max={todayInputValue()}
                aria-invalid={!!form.formState.errors.visitDate}
                disabled={isSubmitting}
                {...form.register("visitDate")}
              />
              <FieldError errors={[form.formState.errors.visitDate]} />
            </Field>

            <Field>
              <ImageUpload
                label={t("imagesLabel")}
                description={t("imagesDescription")}
                folderKey="review"
                maxImages={MAX_REVIEW_IMAGES}
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
