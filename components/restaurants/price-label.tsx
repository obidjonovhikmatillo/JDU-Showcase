import { Coins } from "lucide-react";

import { formatAverageSpend } from "@/lib/format-price";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type PriceLabelProps = {
  priceLevel: number | null;
  locale: Locale | string;
  perVisitLabel?: string;
  className?: string;
  variant?: "inline" | "prominent";
};

export function PriceLabel({
  priceLevel,
  locale,
  perVisitLabel,
  className,
  variant = "inline",
}: PriceLabelProps) {
  const amount = formatAverageSpend(priceLevel, locale);

  if (!amount) {
    return null;
  }

  if (variant === "prominent") {
    return (
      <p className={cn("text-2xl font-semibold text-foreground", className)}>
        <span className="inline-flex items-center gap-2">
          <Coins className="size-5 text-primary" aria-hidden />
          {amount}
        </span>
        {perVisitLabel ? (
          <span className="mt-1 block text-base font-normal text-muted-foreground">
            {perVisitLabel}
          </span>
        ) : null}
      </p>
    );
  }

  return (
    <p className={cn("inline-flex items-center gap-1.5 text-sm", className)}>
      <Coins className="size-3.5 shrink-0 text-primary" aria-hidden />
      <span className="font-semibold text-foreground">{amount}</span>
      {perVisitLabel ? (
        <span className="text-muted-foreground">· {perVisitLabel}</span>
      ) : null}
    </p>
  );
}
