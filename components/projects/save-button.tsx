"use client";

import { Bookmark } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { toggleSave } from "@/lib/actions/project-interactions";
import { cn } from "@/lib/utils";

type SaveButtonProps = {
  projectId: string;
  initialSaved: boolean;
  disabled?: boolean;
  className?: string;
};

export function SaveButton({
  projectId,
  initialSaved,
  disabled = false,
  className,
}: SaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (disabled) return;

    const wasSaved = saved;
    setSaved(!wasSaved);

    startTransition(async () => {
      const result = await toggleSave(projectId);
      if (result.error) {
        setSaved(wasSaved);
      }
    });
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn(
        "gap-1.5 text-muted-foreground transition-colors",
        saved && "text-[#0057ff] hover:text-[#0046cc]",
        className,
      )}
      onClick={handleClick}
      disabled={isPending}
    >
      <Bookmark
        className={cn("size-4", saved && "fill-current")}
        aria-hidden
      />
    </Button>
  );
}
