"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Language, Role } from "@prisma/client";
import {
  BookmarkIcon,
  HeartIcon,
  Loader2Icon,
  PencilIcon,
  UploadIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { ProfileAvatarField } from "@/components/profile/profile-avatar-field";
import { ProjectCard } from "@/components/projects/project-card";
import { UploadImage } from "@/components/uploads/upload-image";
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
import { Link, useRouter } from "@/i18n/navigation";
import { updateProfile } from "@/lib/actions/profile";
import type { ProfileStats } from "@/lib/data/profile.server";
import type { ProjectSummary } from "@/lib/data/project-types";
import { languageValues } from "@/lib/constants/languages";
import {
  createProfileUpdateSchema,
  type ProfileUpdateInput,
} from "@/lib/validations/create-auth-schemas";
import { cn } from "@/lib/utils";
import { normalizeImageSrcForDisplay } from "@/lib/uploads/uploaded-image-url";
import { initialsFromName } from "@/lib/display-name";

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
  userProjects: ProjectSummary[];
  likedProjects: ProjectSummary[];
  savedProjects: ProjectSummary[];
};

type TabKey = "work" | "liked" | "saved";

function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/10 px-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <Icon className="size-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0057ff] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0046cc]"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

function ProjectGrid({ projects }: { projects: ProjectSummary[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

export function ProfilePanel({
  user,
  stats,
  registeredDateLabel,
  userProjects,
  likedProjects,
  savedProjects,
}: ProfilePanelProps) {
  const router = useRouter();
  const { update } = useSession();
  const [editOpen, setEditOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("work");
  const [serverError, setServerError] = useState<string | null>(null);
  const t = useTranslations("ProfilePanel");
  const tCommon = useTranslations("Common");
  const tValidation = useTranslations("Validation");
  const tToast = useTranslations("Toast");
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
        fullName: user.fullName,
        profileHeadline: user.profileHeadline ?? "",
        preferredLanguage: user.preferredLanguage,
        avatarUrl: user.avatarUrl ?? "",
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
          form.setError(field as keyof ProfileUpdateInput, {
            message: messages[0],
          });
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
        result.profileHeadline ?? (values.profileHeadline?.trim() || null),
      preferredLanguage:
        (result.preferredLanguage ?? values.preferredLanguage) as Language,
      avatarUrl: result.avatarUrl ?? (values.avatarUrl?.trim() || null),
    };

    await update(nextProfile);

    toast.success(tToast("profileUpdated"));
    handleEditOpenChange(false);
    router.refresh();
  }

  const displayAvatar = user.avatarUrl
    ? normalizeImageSrcForDisplay(user.avatarUrl)
    : "";

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "work", label: "Work", count: userProjects.length },
    { key: "liked", label: "Liked", count: likedProjects.length },
    { key: "saved", label: "Saved", count: savedProjects.length },
  ];

  return (
    <>
      {/* ---- Profile Header (Dribbble style) ---- */}
      <div className="flex flex-col items-center pb-8 pt-4">
        {/* Avatar */}
        <div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-border/40 bg-muted shadow-sm">
          {displayAvatar ? (
            <UploadImage
              src={displayAvatar}
              alt={user.fullName}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <span className="text-2xl font-bold text-foreground">
              {initialsFromName(user.fullName)}
            </span>
          )}
        </div>

        {/* Name */}
        <h1 className="mt-4 text-2xl font-bold text-foreground">
          {user.fullName}
        </h1>

        {/* Headline / location */}
        {user.profileHeadline && (
          <p className="mt-1 text-sm text-muted-foreground">
            {user.profileHeadline}
          </p>
        )}

        {/* Stats row */}
        <div className="mt-3 flex items-center gap-6 text-sm text-muted-foreground">
          <span>
            <span className="font-semibold text-foreground">
              {stats.totalComments}
            </span>{" "}
            Reviews
          </span>
          <span>
            <span className="font-semibold text-foreground">
              {likedProjects.length}
            </span>{" "}
            Likes
          </span>
          <span>
            <span className="font-semibold text-foreground">
              {savedProjects.length}
            </span>{" "}
            Saved
          </span>
        </div>

        {/* Edit Profile button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4 gap-1.5 rounded-full px-5"
          onClick={() => setEditOpen(true)}
        >
          <PencilIcon className="size-3.5" aria-hidden />
          {t("editButton")}
        </Button>
      </div>

      {/* ---- Tab Bar ---- */}
      <div className="border-b border-border">
        <nav className="mx-auto flex max-w-3xl justify-center gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={cn(
                "relative pb-3 text-sm font-medium transition-colors",
                activeTab === tab.key
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              <span className="ml-1.5 text-xs text-muted-foreground">
                {tab.count}
              </span>
              {activeTab === tab.key && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#0057ff]" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* ---- Tab Content ---- */}
      <div className="pt-8">
        {activeTab === "work" && (
          <>
            {userProjects.length > 0 ? (
              <ProjectGrid projects={userProjects} />
            ) : (
              <EmptyState
                icon={UploadIcon}
                title="Upload your first project"
                description="Show off your work to the JDU community. Your published projects will appear here."
                actionLabel="Upload Project"
                actionHref="/upload"
              />
            )}
          </>
        )}

        {activeTab === "liked" && (
          <>
            {likedProjects.length > 0 ? (
              <ProjectGrid projects={likedProjects} />
            ) : (
              <EmptyState
                icon={HeartIcon}
                title="No liked projects yet"
                description="Projects you like will show up here. Explore and discover work that inspires you."
                actionLabel="Browse Projects"
                actionHref="/projects"
              />
            )}
          </>
        )}

        {activeTab === "saved" && (
          <>
            {savedProjects.length > 0 ? (
              <ProjectGrid projects={savedProjects} />
            ) : (
              <EmptyState
                icon={BookmarkIcon}
                title="No saved projects yet"
                description="Save projects to revisit later. Your bookmarks will appear here."
                actionLabel="Browse Projects"
                actionHref="/projects"
              />
            )}
          </>
        )}
      </div>

      {/* ---- Edit Profile Dialog ---- */}
      <Dialog open={editOpen} onOpenChange={handleEditOpenChange}>
        <DialogPortal>
          <DialogBackdrop />
          <DialogPopup className="max-w-lg">
            <DialogTitle>{t("editTitle")}</DialogTitle>
            <DialogDescription className="mt-2">
              {t("editDescription")}
            </DialogDescription>

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-6 space-y-5"
            >
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
                        fullName={user.fullName}
                        disabled={isSubmitting}
                        invalid={!!form.formState.errors.avatarUrl}
                      />
                    )}
                  />
                  <FieldError errors={[form.formState.errors.avatarUrl]} />
                </Field>

                <Field data-invalid={!!form.formState.errors.fullName}>
                  <FieldLabel htmlFor="profile-fullName">
                    {t("fullName")}
                  </FieldLabel>
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
                  <FieldLabel htmlFor="profile-headline">
                    {t("profileHeadline")}
                  </FieldLabel>
                  <Input
                    id="profile-headline"
                    placeholder={t("profileHeadlinePlaceholder")}
                    aria-invalid={!!form.formState.errors.profileHeadline}
                    disabled={isSubmitting}
                    {...form.register("profileHeadline")}
                  />
                  <FieldError
                    errors={[form.formState.errors.profileHeadline]}
                  />
                </Field>

                <Field
                  data-invalid={!!form.formState.errors.preferredLanguage}
                >
                  <FieldLabel htmlFor="profile-language">
                    {t("preferredLanguage")}
                  </FieldLabel>
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
                  <FieldError
                    errors={[form.formState.errors.preferredLanguage]}
                  />
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
                      <Loader2Icon
                        className="size-4 animate-spin"
                        aria-hidden
                      />
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
