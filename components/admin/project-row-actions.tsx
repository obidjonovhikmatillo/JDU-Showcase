"use client";

import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { deleteProject, toggleProjectPublished } from "@/lib/actions/admin-project";
import { cn } from "@/lib/utils";

type ProjectRowActionsProps = {
  projectId: string;
  slug: string;
  isPublished: boolean;
};

export function ProjectRowActions({
  projectId,
  slug,
  isPublished,
}: ProjectRowActionsProps) {
  const router = useRouter();
  const t = useTranslations("AdminProjects");
  const tToast = useTranslations("Toast");

  async function handleTogglePublish() {
    const formData = new FormData();
    formData.set("projectId", projectId);
    formData.set("isPublished", String(!isPublished));
    const result = await toggleProjectPublished(formData);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(
      !isPublished ? tToast("projectPublished") : tToast("projectUnpublished"),
    );
    router.refresh();
  }

  async function handleDelete() {
    const formData = new FormData();
    formData.set("projectId", projectId);
    const result = await deleteProject({}, formData);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(tToast("projectDeleted"));
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Link href={`/admin/projects/${slug}/edit`} className={cn(buttonVariants({ size: "sm" }))}>
        {t("edit")}
      </Link>
      <AdminConfirmDialog
        title={isPublished ? t("unpublishTitle") : t("publishTitle")}
        description={isPublished ? t("unpublishDescription") : t("publishDescription")}
        confirmLabel={isPublished ? t("unpublish") : t("publish")}
        triggerLabel={isPublished ? t("unpublish") : t("publish")}
        triggerVariant="outline"
        onConfirm={handleTogglePublish}
      />
      <AdminConfirmDialog
        title={t("deleteTitle")}
        description={t("deleteDescription")}
        confirmLabel={t("deleteConfirm")}
        triggerLabel={t("delete")}
        onConfirm={handleDelete}
      />
    </div>
  );
}
