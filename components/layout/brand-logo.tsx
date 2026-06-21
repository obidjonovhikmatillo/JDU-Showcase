"use client";

import { TaomchiIcon } from "@/components/layout/taomchi-icon";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  label: string;
  showLabel?: boolean;
  className?: string;
};

export function BrandLogo({ label, showLabel = true, className }: BrandLogoProps) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2", className)}>
      <TaomchiIcon />
      {showLabel ? (
        <span className="truncate text-xl font-semibold tracking-tight text-primary">{label}</span>
      ) : null}
    </span>
  );
}
