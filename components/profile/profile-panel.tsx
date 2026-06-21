"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Language, Role } from "@prisma/client";
import { Loader2Icon, PencilIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { ProfileAvatarField } from "@/components/profile/profile-avatar-field";
import { UploadImage } from "@/components/uploads/upload-image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useRouter } from "@/i18n/navigation";
import { updateProfile } from "@/lib/actions/profile";
import type { ProfileStats } from "@/lib/data/profile.server";
import { languageValues } from "@/lib/constants/languages";
import {
  createProfileUpdateSchema,
  type ProfileUpdateInput,
} from "@/lib/validations/create-auth-schemas";
import { cn } from "@/lib/utils";
import { normalizeImageSrcForDisplay } from "@/lib/uploads/uploaded-image-url";

import { splitDisplayName } from "@/lib/display-name";

type ProfilePanelProps = {
  user: {
    id: string;
    fullName: string;
    email: string;
    role: Role;
    preferredLanguage: Language;
    avatarUrl: string | null;
    profileHeadline: string | null;
    createdAt: Date;
  };
  stats: ProfileStats;
  registeredDateLabel: string;
};

function initialsFromName(fullName: string) {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatAverageRating(value: number | null) {
  if (value === null) {
    return "—";
  }

  return value.toFixed(1);
}

export function ProfilePanel({ user, stats, registeredDateLabel }: ProfilePanelProps) {
  const router = useRouter();
  const { update } = useSession();
  const [editOpen, setEditOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [displayUser, setDisplayUser] = useState(user);
  const t = useTranslations("ProfilePanel");
  const tCommon = useTranslations("Common");
  const tValidation = useTranslations("Validation");
  const tToast = useTranslations("Toast");
  const tRoles = useTranslations("Roles");
  const tLang = useTranslations("LanguageNames");

  const profileUpdateSchema = useMemo(
    () => createProfileUpdateSchema((key) => tValidation(key)),
    [tValidation],
  );

  const form = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: user.fullName,
      profileHeadline: user.profileHeadline ?? "",
      preferredLanguage: user.preferredLanguage,
      avatarUrl: user.avatarUrl ?? "",
    },
  });

  useEffect(() => {
    setDisplayUser(user);
    form.reset({
      fullName: user.fullName,
      profileHeadline: user.profileHeadline ?? "",
      preferredLanguage: user.preferredLanguage,
      avatarUrl: user.avatarUrl ?? "",
    });
  }, [user, form]);

  const isSubmitting = form.formState.isSubmitting;

  function handleEditOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      form.reset({
        fullName: displayUser.fullName,
        profileHeadline: displayUser.profileHeadline ?? "",
        preferredLanguage: displayUser.preferredLanguage,
        avatarUrl: displayUser.avatarUrl ?? "",
      });
      setServerError(null);
    }

    setEditOpen(nextOpen);
  }

  async function onSubmit(values: ProfileUpdateInput) {
    setServerError(null);

    const formData = new FormData();
    formData.set("fullName", values.fullName);
    formData.set("profileHeadline", values.profileHeadline ?? "");
    formData.set("preferredLanguage", values.preferredLanguage);
    formData.set("avatarUrl", values.avatarUrl ?? "");

    const result = await updateProfile({}, formData);

    if (result.fieldErrors) {
      for (const [field, messages] of Object.entries(result.fieldErrors)) {
        if (messages?.[0]) {
          form.setError(field as keyof ProfileUpdateInput, { message: messages[0] });
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

    const nextProfile = {
      fullName: result.fullName ?? values.fullName,
      profileHeadline:
        result.profileHeadline ??
        (values.profileHeadline?.trim() || null),
      preferredLanguage:
        (result.preferredLanguage ?? values.preferredLanguage) as Language,
      avatarUrl: result.avatarUrl ?? (values.avatarUrl?.trim() || null),
    };

    setDisplayUser((current) => ({
      ...current,
      ...nextProfile,
    }));

    await update(nextProfile);

    toast.success(tToast("profileUpdated"));
    handleEditOpenChange(false);
    router.refresh();
  }

  const displayAvatar = displayUser.avatarUrl
    ? normalizeImageSrcForDisplay(displayUser.avatarUrl)
    : "";
  const { primary, secondary } = splitDisplayName(
    displayUser.fullName,
    displayUser.profileHeadline,
  );

  return (
    <>
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
          <div className="space-y-1.5">
            <CardTitle>{t("overviewTitle")}</CardTitle>
            <CardDescription>{t("overviewDescription")}</CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 gap-1.5"
            onClick={() => setEditOpen(true)}
          >
            <PencilIcon className="size-3.5" aria-hidden />
            {t("editButton")}
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-muted">
              {displayAvatar ? (
                <UploadImage
                  src={displayAvatar}
                  alt={t("avatarAlt", { name: displayUser.fullName })}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <span className="text-lg font-semibold text-foreground">
                  {initialsFromName(displayUser.fullName)}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-lg font-semibold text-foreground">{primary}</p>
              {secondary ? (
                <p className="text-sm text-muted-foreground">{secondary}</p>
              ) : (
                <p className="text-sm text-muted-foreground">{displayUser.email}</p>
              )}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
              <p className="text-xs text-muted-foreground">{t("totalReviews")}</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{stats.totalReviews}</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
              <p className="text-xs text-muted-foreground">{t("averageRatingGiven")}</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {formatAverageRating(stats.averageRatingGiven)}
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-3">
              <span className="text-muted-foreground">{t("email")}</span>
              <span className="font-medium text-foreground">{user.email}</span>
            </div>
            <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-3">
              <span className="text-muted-foreground">{t("role")}</span>
              <span className="font-medium text-foreground">{tRoles(user.role)}</span>
            </div>
            <div className="flex items-start justify-between gap-4 border-b border-border/60 pb-3">
              <span className="text-muted-foreground">{t("preferredLanguage")}</span>
              <span className="font-medium text-foreground">
                {tLang(displayUser.preferredLanguage)}
              </span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <span className="text-muted-foreground">{t("registered")}</span>
              <span className="font-medium text-foreground">{registeredDateLabel}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={handleEditOpenChange}>
        <DialogPortal>
          <DialogBackdrop />
          <DialogPopup className="max-w-lg">
            <DialogTitle>{t("editTitle")}</DialogTitle>
            <DialogDescription className="mt-2">{t("editDescription")}</DialogDescription>

            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-5">
              {serverError ? (
                <div
                  role="alert"
                  className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {serverError}
                </div>
              ) : null}

              <FieldGroup>
                <Field data-invalid={!!form.formState.errors.avatarUrl}>
                  <Controller
                    control={form.control}
                    name="avatarUrl"
                    render={({ field }) => (
                      <ProfileAvatarField
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        fullName={displayUser.fullName}
                        disabled={isSubmitting}
                        invalid={!!form.formState.errors.avatarUrl}
                      />
                    )}
                  />
                  <FieldError errors={[form.formState.errors.avatarUrl]} />
                </Field>

                <Field data-invalid={!!form.formState.errors.fullName}>
                  <FieldLabel htmlFor="profile-fullName">{t("fullName")}</FieldLabel>
                  <Input
                    id="profile-fullName"
                    autoComplete="name"
                    aria-invalid={!!form.formState.errors.fullName}
                    disabled={isSubmitting}
                    {...form.register("fullName")}
                  />
                  <FieldError errors={[form.formState.errors.fullName]} />
                </Field>

                <Field data-invalid={!!form.formState.errors.profileHeadline}>
                  <FieldLabel htmlFor="profile-headline">{t("profileHeadline")}</FieldLabel>
                  <Input
                    id="profile-headline"
                    placeholder={t("profileHeadlinePlaceholder")}
                    aria-invalid={!!form.formState.errors.profileHeadline}
                    disabled={isSubmitting}
                    {...form.register("profileHeadline")}
                  />
                  <FieldError errors={[form.formState.errors.profileHeadline]} />
                </Field>

                <Field data-invalid={!!form.formState.errors.preferredLanguage}>
                  <FieldLabel htmlFor="profile-language">{t("preferredLanguage")}</FieldLabel>
                  <select
                    id="profile-language"
                    className={cn(
                      "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
                    )}
                    aria-invalid={!!form.formState.errors.preferredLanguage}
                    disabled={isSubmitting}
                    {...form.register("preferredLanguage")}
                  >
                    {languageValues.map((value) => (
                      <option key={value} value={value}>
                        {tLang(value)}
                      </option>
                    ))}
                  </select>
                  <FieldError errors={[form.formState.errors.preferredLanguage]} />
                </Field>
              </FieldGroup>

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => handleEditOpenChange(false)}
                >
                  {tCommon("close")}
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
    </>
  );
}
