"use client";

import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

type RatingInputProps = {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  invalid?: boolean;
};

export function RatingInput({
  value,
  onChange,
  disabled = false,
  invalid = false,
}: RatingInputProps) {
  const t = useTranslations("ReviewForm");

  return (
    <div
      className={cn(
        "flex items-center gap-1",
        invalid && "rounded-lg ring-2 ring-destructive/30",
      )}
      role="radiogroup"
      aria-label={t("ratingLabel")}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const rating = index + 1;
        const filled = rating <= value;

        return (
          <button
            key={rating}
            type="button"
            role="radio"
            aria-checked={value === rating}
            aria-label={t("ratingOption", { rating })}
            disabled={disabled}
            onClick={() => onChange(rating)}
            className={cn(
              "rounded-md p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              filled ? "text-amber-400" : "text-muted-foreground/30 hover:text-amber-300",
            )}
          >
            <Star
              className={cn("size-7", filled && "fill-amber-400")}
              aria-hidden
            />
          </button>
        );
      })}
    </div>
  );
}
