"use client";

import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogPopup,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

type AdminConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  triggerLabel: string;
  triggerVariant?: "default" | "destructive" | "outline" | "ghost";
  onConfirm: () => Promise<void>;
  disabled?: boolean;
};

export function AdminConfirmDialog({
  title,
  description,
  confirmLabel,
  triggerLabel,
  triggerVariant = "destructive",
  onConfirm,
  disabled = false,
}: AdminConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const t = useTranslations("AdminCommon");

  async function handleConfirm() {
    setIsPending(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        disabled={disabled}
        className={cn(buttonVariants({ size: "sm", variant: triggerVariant }))}
      >
        {triggerLabel}
      </AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogBackdrop />
        <AlertDialogPopup>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <AlertDialogClose className={cn(buttonVariants({ variant: "outline" }))} disabled={isPending}>
              {t("cancel")}
            </AlertDialogClose>
            <Button type="button" variant="destructive" disabled={isPending} onClick={() => void handleConfirm()}>
              {isPending ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" aria-hidden />
                  {t("working")}
                </>
              ) : (
                confirmLabel
              )}
            </Button>
          </div>
        </AlertDialogPopup>
      </AlertDialogPortal>
    </AlertDialog>
  );
}
