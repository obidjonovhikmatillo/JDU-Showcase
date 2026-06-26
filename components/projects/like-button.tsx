"use client";

import { Heart } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { toggleLike } from "@/lib/actions/project-interactions";
import { cn } from "@/lib/utils";

type LikeButtonProps = {
  projectId: string;
  initialLiked: boolean;
  likeCount: number;
  /** When true, user is not logged in - clicking will do nothing visually */
  disabled?: boolean;
  className?: string;
};

export function LikeButton({
  projectId,
  initialLiked,
  likeCount,
  disabled = false,
  className,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(likeCount);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (disabled) return;

    // Optimistic update
    const wasLiked = liked;
    setLiked(!wasLiked);
    setCount((prev) => (wasLiked ? prev - 1 : prev + 1));

    startTransition(async () => {
      const result = await toggleLike(projectId);
      if (result.error) {
        // Revert on error
        setLiked(wasLiked);
        setCount((prev) => (wasLiked ? prev + 1 : prev - 1));
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
        liked && "text-red-500 hover:text-red-600",
        className,
      )}
      onClick={handleClick}
      disabled={isPending}
    >
      <Heart
        className={cn("size-4", liked && "fill-current")}
        aria-hidden
      />
      <span className="text-xs font-medium">{count}</span>
    </Button>
  );
}
