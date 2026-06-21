"use client";

import { Toaster as Sonner } from "sonner";

export function Toaster() {
  return (
    <Sonner
      richColors
      closeButton
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "rounded-xl border border-border bg-background text-foreground shadow-lg",
          title: "text-base/7 font-medium sm:text-sm/6",
          description: "text-base/7 text-muted-foreground sm:text-sm/6",
          actionButton: "rounded-lg bg-primary text-primary-foreground",
          cancelButton: "rounded-lg bg-muted text-foreground",
          closeButton:
            "rounded-md border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
        },
      }}
    />
  );
}
