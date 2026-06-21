"use client";

import { ImageIcon, Loader2Icon, UploadCloudIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import type { UploadFolderKey } from "@/lib/uploads/image-upload-constants";
import type { ExistingUploadedImage } from "@/lib/uploads/image-upload-types";
import { deleteUploadedImage, uploadImageFile } from "@/lib/uploads/upload-client";
import {
  type ImageValidationCode,
  validateImageFile,
} from "@/lib/uploads/validate-image-file";
import { cn } from "@/lib/utils";

type PendingUpload = {
  key: string;
  previewUrl: string;
};

type ImageUploadProps = {
  value: ExistingUploadedImage[];
  onChange: (images: ExistingUploadedImage[]) => void;
  folderKey: UploadFolderKey;
  maxImages: number;
  disabled?: boolean;
  label?: string;
  description?: string;
  multiple?: boolean;
};

function validationMessage(
  tValidation: ReturnType<typeof useTranslations<"Validation">>,
  code: ImageValidationCode,
) {
  switch (code) {
    case "imageRequired":
      return tValidation("imageRequired");
    case "imageTooLarge":
      return tValidation("imageTooLarge");
    case "imageInvalidType":
      return tValidation("imageInvalidType");
    default:
      return tValidation("imageInvalidType");
  }
}

function uploadErrorMessage(
  t: ReturnType<typeof useTranslations<"ImageUpload">>,
  tValidation: ReturnType<typeof useTranslations<"Validation">>,
  code: string,
) {
  switch (code) {
    case "BLOB_NOT_CONFIGURED":
      return t("blobNotConfigured");
    case "INVALID_FILE":
      return tValidation("imageInvalidType");
    case "UNAUTHORIZED":
      return t("uploadUnauthorized");
    case "FORBIDDEN":
      return t("uploadForbidden");
    default:
      return t("uploadFailed");
  }
}

export function ImageUpload({
  value,
  onChange,
  folderKey,
  maxImages,
  disabled = false,
  label,
  description,
  multiple = true,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadingKeys, setUploadingKeys] = useState<string[]>([]);
  const [removingKeys, setRemovingKeys] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const t = useTranslations("ImageUpload");
  const tValidation = useTranslations("Validation");

  const atLimit = value.length >= maxImages;
  const canAddMore = !atLimit && !disabled;

  async function processFiles(fileList: FileList | File[]) {
    if (!canAddMore) {
      return;
    }

    setErrorMessage(null);
    const files = Array.from(fileList);
    const remainingSlots = maxImages - value.length;
    const selectedFiles = multiple ? files.slice(0, remainingSlots) : files.slice(0, 1);
    let nextImages = [...value];

    for (const file of selectedFiles) {
      const validation = validateImageFile(file);
      if (!validation.ok) {
        setErrorMessage(validationMessage(tValidation, validation.code));
        continue;
      }

      const pendingKey = `${file.name}-${file.lastModified}`;
      const previewUrl = URL.createObjectURL(file);
      setUploadingKeys((current) => [...current, pendingKey]);

      try {
        const uploaded = await uploadImageFile(file, folderKey);
        nextImages = [...nextImages, uploaded];
        onChange(nextImages);
      } catch (error) {
        const code = error instanceof Error ? error.message : "UPLOAD_FAILED";
        setErrorMessage(uploadErrorMessage(t, tValidation, code));
      } finally {
        URL.revokeObjectURL(previewUrl);
        setUploadingKeys((current) => current.filter((key) => key !== pendingKey));
      }
    }
  }

  async function handleRemove(image: ExistingUploadedImage, index: number) {
    const removeKey = image.publicId ?? image.url;
    setRemovingKeys((current) => [...current, removeKey]);
    setErrorMessage(null);

    try {
      if (image.publicId) {
        await deleteUploadedImage(image.publicId, folderKey);
      }

      onChange(value.filter((_, itemIndex) => itemIndex !== index));
    } catch {
      setErrorMessage(t("deleteFailed"));
    } finally {
      setRemovingKeys((current) => current.filter((key) => key !== removeKey));
    }
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragActive(false);

    if (!canAddMore) {
      return;
    }

    void processFiles(event.dataTransfer.files);
  }

  const pendingUploads: PendingUpload[] = uploadingKeys.map((key) => ({
    key,
    previewUrl: "",
  }));

  return (
    <div className="space-y-3">
      {label ? <p className="text-sm font-medium text-foreground">{label}</p> : null}
      {description ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : null}

      <div
        role="button"
        tabIndex={canAddMore ? 0 : -1}
        aria-disabled={!canAddMore}
        onKeyDown={(event) => {
          if (canAddMore && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          if (canAddMore) {
            setDragActive(true);
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (canAddMore) {
            setDragActive(true);
          }
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragActive(false);
        }}
        onDrop={handleDrop}
        className={cn(
          "rounded-xl border border-dashed px-4 py-8 text-center transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-border bg-muted/20",
          canAddMore ? "cursor-pointer hover:bg-muted/30" : "cursor-not-allowed opacity-60",
        )}
        onClick={() => {
          if (canAddMore) {
            inputRef.current?.click();
          }
        }}
      >
        <UploadCloudIcon className="mx-auto size-8 text-muted-foreground" aria-hidden />
        <p className="mt-3 text-sm font-medium text-foreground">{t("dropTitle")}</p>
        <p className="mt-1 text-xs text-muted-foreground">{t("dropHint")}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          {t("limits", { max: maxImages, sizeMb: 5 })}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          multiple={multiple && maxImages > 1}
          className="hidden"
          disabled={!canAddMore}
          onChange={(event) => {
            if (event.target.files) {
              void processFiles(event.target.files);
              event.target.value = "";
            }
          }}
        />
      </div>

      {errorMessage ? (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}

      {value.length > 0 || pendingUploads.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {value.map((image, index) => {
            const removeKey = image.publicId ?? image.url;
            const isRemoving = removingKeys.includes(removeKey);

            return (
              <div
                key={removeKey}
                className="relative aspect-square overflow-hidden rounded-lg border border-border/60 bg-muted/20"
              >
                <Image
                  src={image.url}
                  alt={t("previewAlt", { index: index + 1 })}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
                <Button
                  type="button"
                  size="icon-xs"
                  variant="destructive"
                  disabled={disabled || isRemoving}
                  className="absolute top-2 right-2"
                  aria-label={t("removeImage")}
                  onClick={(event) => {
                    event.stopPropagation();
                    void handleRemove(image, index);
                  }}
                >
                  {isRemoving ? (
                    <Loader2Icon className="size-3 animate-spin" aria-hidden />
                  ) : (
                    <XIcon className="size-3" aria-hidden />
                  )}
                </Button>
              </div>
            );
          })}

          {pendingUploads.map((pending) => (
            <div
              key={pending.key}
              className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/20"
            >
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2Icon className="size-6 animate-spin" aria-hidden />
                <span className="text-xs">{t("uploading")}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ImageIcon className="size-4" aria-hidden />
          {t("noImages")}
        </div>
      )}

      {atLimit ? (
        <p className="text-xs text-muted-foreground">{t("maxReached", { max: maxImages })}</p>
      ) : null}
    </div>
  );
}
