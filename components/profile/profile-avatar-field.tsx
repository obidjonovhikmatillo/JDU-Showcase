"use client";

import { Loader2Icon, UploadCloudIcon, UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

import { UploadImage } from "@/components/uploads/upload-image";

import { Button } from "@/components/ui/button";
import { uploadImageFile } from "@/lib/uploads/upload-client";
import { validateImageFile } from "@/lib/uploads/validate-image-file";
import { cn } from "@/lib/utils";
import { normalizeImageSrcForDisplay } from "@/lib/uploads/uploaded-image-url";

type ProfileAvatarFieldProps = {
  value: string;
  onChange: (url: string) => void;
  fullName: string;
  disabled?: boolean;
  invalid?: boolean;
};

function initialsFromName(fullName: string) {
  return fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function ProfileAvatarField({
  value,
  onChange,
  fullName,
  disabled = false,
  invalid = false,
}: ProfileAvatarFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const t = useTranslations("ProfilePanel");
  const tImage = useTranslations("ImageUpload");
  const tValidation = useTranslations("Validation");

  const avatarUrl = value.trim() || null;

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file || disabled) {
      return;
    }

    setErrorMessage(null);
    const validation = validateImageFile(file);

    if (!validation.ok) {
      const message =
        validation.code === "imageTooLarge"
          ? tValidation("imageTooLarge")
          : validation.code === "imageRequired"
            ? tValidation("imageRequired")
            : tValidation("imageInvalidType");
      setErrorMessage(message);
      return;
    }

    setIsUploading(true);

    try {
      const uploaded = await uploadImageFile(file, "avatar");
      onChange(uploaded.url);
    } catch (error) {
      const code = error instanceof Error ? error.message : "UPLOAD_FAILED";
      const message =
        code === "CLOUDINARY_NOT_CONFIGURED"
          ? tImage("cloudinaryNotConfigured")
          : code === "UNAUTHORIZED"
            ? tImage("uploadUnauthorized")
            : code === "FORBIDDEN"
              ? tImage("uploadForbidden")
              : tImage("uploadFailed");
      setErrorMessage(message);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div
          className={cn(
            "relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted",
            invalid ? "border-destructive" : "border-border/60",
          )}
        >
          {avatarUrl ? (
            <UploadImage
              src={normalizeImageSrcForDisplay(avatarUrl)}
              alt={t("avatarAlt", { name: fullName })}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <span className="flex flex-col items-center gap-1 text-muted-foreground">
              {initialsFromName(fullName) ? (
                <span className="text-xl font-semibold text-foreground">
                  {initialsFromName(fullName)}
                </span>
              ) : (
                <UserIcon className="size-8" aria-hidden />
              )}
            </span>
          )}
          {isUploading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70">
              <Loader2Icon className="size-6 animate-spin text-primary" aria-hidden />
            </div>
          ) : null}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">{t("avatarTitle")}</p>
          <p className="text-sm text-muted-foreground">{t("avatarDescription")}</p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || isUploading}
              onClick={() => inputRef.current?.click()}
            >
              <UploadCloudIcon className="size-4" aria-hidden />
              {avatarUrl ? t("changeAvatar") : t("uploadAvatar")}
            </Button>
            {avatarUrl ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={disabled || isUploading}
                onClick={() => onChange("")}
              >
                {t("removeAvatar")}
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        disabled={disabled || isUploading}
        onChange={handleFileChange}
      />

      {errorMessage ? (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
