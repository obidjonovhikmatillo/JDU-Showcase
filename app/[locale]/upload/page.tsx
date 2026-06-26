"use client";

import { ImageIcon, Loader2Icon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import { Link, useRouter } from "@/i18n/navigation";
import { createUserProject } from "@/lib/actions/user-project";
import { cn } from "@/lib/utils";

type CategoryOption = { id: string; nameEn: string };

function resizeImage(file: File, maxWidth: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context unavailable"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/webp", 0.85));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function UploadPage() {
  const { status } = useSession();
  const router = useRouter();
  const t = useTranslations("Upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string>("");
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [publishIntent, setPublishIntent] = useState(false);

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch {
        // Categories will just be empty
      }
    }
    loadCategories();
  }, []);

  const handleImageFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5MB or smaller");
      return;
    }
    try {
      const dataUrl = await resizeImage(file, 1200);
      setImagePreview(dataUrl);
      setImageDataUrl(dataUrl);
    } catch {
      toast.error("Failed to process image");
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleImageFile(file);
    },
    [handleImageFile],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleImageFile(file);
    },
    [handleImageFile],
  );

  const [state, formAction, isPending] = useActionState(createUserProject, {});

  useEffect(() => {
    if (state.success) {
      toast.success("Project created successfully!");
      router.push("/profile");
    }
    if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-50 border-b border-border/40 bg-white/95 backdrop-blur dark:bg-background/95">
        <div className="mx-auto flex max-w-[800px] items-center justify-between px-5 py-3">
          <Link
            href="/profile"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("cancel")}
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              form="upload-form"
              disabled={isPending}
              onClick={() => setPublishIntent(false)}
              className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
            >
              {isPending && !publishIntent ? t("saving") : t("saveDraft")}
            </button>
            <button
              type="submit"
              form="upload-form"
              disabled={isPending}
              onClick={() => setPublishIntent(true)}
              className="rounded-full bg-[#0057ff] px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#0046cc] disabled:opacity-50"
            >
              {isPending && publishIntent ? (
                <span className="flex items-center gap-1.5">
                  <Loader2Icon className="size-3.5 animate-spin" />
                  {t("publishing")}
                </span>
              ) : (
                t("publish")
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-[800px] px-5 py-8">
        <h1 className="mb-8 text-center text-2xl font-bold text-foreground sm:text-3xl">
          {t("pageTitle")}
        </h1>

        <form
          id="upload-form"
          action={(formData) => {
            formData.set("mainImageUrl", imageDataUrl);
            formData.set("isPublished", publishIntent ? "true" : "false");
            formAction(formData);
          }}
          className="space-y-8"
        >
          {/* Image drop zone */}
          <div
            role="button"
            tabIndex={0}
            className={cn(
              "relative flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-colors sm:min-h-[340px]",
              isDragging
                ? "border-[#ea4c89] bg-[#ea4c89]/5"
                : imagePreview
                  ? "border-transparent bg-muted/20"
                  : "border-border/60 bg-muted/10 hover:border-border hover:bg-muted/20",
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
          >
            {imagePreview ? (
              <>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-[300px] rounded-lg object-contain sm:max-h-[400px]"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 rounded-full bg-black/60 p-1.5 text-white transition-colors hover:bg-black/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImagePreview(null);
                    setImageDataUrl("");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                >
                  <XIcon className="size-4" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 px-6 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-[#ea4c89]/10">
                  <ImageIcon className="size-7 text-[#ea4c89]" />
                </div>
                <p className="text-base font-medium text-foreground">
                  {t("dropTitle")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("dropHint")}
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Title input */}
          <input
            name="title"
            type="text"
            placeholder={t("titlePlaceholder")}
            required
            className="w-full border-0 bg-transparent text-2xl font-bold text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-0 sm:text-3xl"
            aria-invalid={!!state.fieldErrors?.title}
          />
          {state.fieldErrors?.title && (
            <p className="text-sm text-destructive">{state.fieldErrors.title[0]}</p>
          )}

          {/* Description textarea */}
          <textarea
            name="description"
            placeholder={t("descriptionPlaceholder")}
            required
            rows={4}
            className="w-full resize-none rounded-lg border border-border/60 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-[#0057ff] focus:outline-none focus:ring-1 focus:ring-[#0057ff]/30"
            aria-invalid={!!state.fieldErrors?.description}
          />
          {state.fieldErrors?.description && (
            <p className="text-sm text-destructive">{state.fieldErrors.description[0]}</p>
          )}

          {/* Form fields grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Category */}
            <div className="space-y-1.5">
              <label
                htmlFor="upload-category"
                className="text-sm font-medium text-foreground"
              >
                {t("category")} *
              </label>
              <select
                id="upload-category"
                name="categoryId"
                required
                className="flex h-10 w-full rounded-lg border border-border/60 bg-transparent px-3 text-sm text-foreground focus:border-[#0057ff] focus:outline-none focus:ring-1 focus:ring-[#0057ff]/30 dark:bg-input/30"
                aria-invalid={!!state.fieldErrors?.categoryId}
              >
                <option value="">{t("category")}...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nameEn}
                  </option>
                ))}
              </select>
              {state.fieldErrors?.categoryId && (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.categoryId[0]}
                </p>
              )}
            </div>

            {/* Tech Stack */}
            <div className="space-y-1.5">
              <label
                htmlFor="upload-techstack"
                className="text-sm font-medium text-foreground"
              >
                {t("techStack")}
              </label>
              <input
                id="upload-techstack"
                name="techStack"
                type="text"
                placeholder="React, Node.js, PostgreSQL..."
                className="flex h-10 w-full rounded-lg border border-border/60 bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-[#0057ff] focus:outline-none focus:ring-1 focus:ring-[#0057ff]/30"
              />
            </div>

            {/* Department */}
            <div className="space-y-1.5">
              <label
                htmlFor="upload-department"
                className="text-sm font-medium text-foreground"
              >
                {t("department")}
              </label>
              <input
                id="upload-department"
                name="department"
                type="text"
                placeholder="Computer Science, Design..."
                className="flex h-10 w-full rounded-lg border border-border/60 bg-transparent px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-[#0057ff] focus:outline-none focus:ring-1 focus:ring-[#0057ff]/30"
              />
            </div>

            {/* Difficulty */}
            <div className="space-y-1.5">
              <label
                htmlFor="upload-difficulty"
                className="text-sm font-medium text-foreground"
              >
                {t("difficulty")}
              </label>
              <select
                id="upload-difficulty"
                name="difficulty"
                className="flex h-10 w-full rounded-lg border border-border/60 bg-transparent px-3 text-sm text-foreground focus:border-[#0057ff] focus:outline-none focus:ring-1 focus:ring-[#0057ff]/30 dark:bg-input/30"
              >
                <option value="">{t("difficulty")}...</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
