"use client";

import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogPopup,
  AlertDialogPortal,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { deleteComment } from "@/lib/actions/comment";

type CommentDeleteDialogProps = {
  commentId: string;
  projectSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CommentDeleteDialog({
  commentId,
  projectSlug,
  open,
  onOpenChange,
}: CommentDeleteDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const t = useTranslations("CommentDelete");
  const tToast = useTranslations("Toast");

  async function handleDelete() {
    setIsDeleting(true);

    const formData = new FormData();
    formData.set("commentId", commentId);
    formData.set("projectSlug", projectSlug);

    const result = await deleteComment({}, formData);

    setIsDeleting(false);

    if (result.forbidden) {
      toast.error(result.error ?? tToast("commentForbidden"));
      onOpenChange(false);
      return;
    }

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(tToast("commentDeleted"));
    onOpenChange(false);
    router.refresh();
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogPortal>
        <AlertDialogBackdrop />
        <AlertDialogPopup>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription className="mt-2">
            {t("description")}
          </AlertDialogDescription>

          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <AlertDialogClose
              disabled={isDeleting}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              {t("cancel")}
            </AlertDialogClose>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" aria-hidden />
                  {t("deleting")}
                </>
              ) : (
                t("confirm")
              )}
            </Button>
          </div>
        </AlertDialogPopup>
      </AlertDialogPortal>
    </AlertDialog>
  );
}
