import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

const sizes = {
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
} as const;

type StarRatingProps = {
  rating: number;
  max?: number;
  size?: keyof typeof sizes;
  className?: string;
};

export function StarRating({
  rating,
  max = 5,
  size = "sm",
  className,
}: StarRatingProps) {
  const rounded = Math.round(rating);

  return (
    <div
      className={cn("inline-flex items-center gap-0.5", className)}
      aria-hidden
    >
      {Array.from({ length: max }, (_, index) => {
        const filled = index < rounded;

        return (
          <Star
            key={index}
            className={cn(
              sizes[size],
              filled ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30",
            )}
          />
        );
      })}
    </div>
  );
}

export function formatRating(rating: number | null): string {
  if (rating === null) {
    return "—";
  }

  return rating.toFixed(1);
}
