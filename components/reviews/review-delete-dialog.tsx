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
import { deleteReview } from "@/lib/actions/review";

type ReviewDeleteDialogProps = {
  reviewId: string;
  restaurantSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ReviewDeleteDialog({
  reviewId,
  restaurantSlug,
  open,
  onOpenChange,
}: ReviewDeleteDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const t = useTranslations("ReviewDelete");
  const tToast = useTranslations("Toast");

  async function handleDelete() {
    setIsDeleting(true);

    const formData = new FormData();
    formData.set("reviewId", reviewId);
    formData.set("restaurantSlug", restaurantSlug);

    const result = await deleteReview({}, formData);

    setIsDeleting(false);

    if (result.forbidden) {
      toast.error(result.error ?? tToast("reviewForbidden"));
      onOpenChange(false);
      return;
    }

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success(tToast("reviewDeleted"));
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
