"use client";

import { ShowcaseIcon } from "@/components/layout/showcase-icon";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  label: string;
  showLabel?: boolean;
  className?: string;
};

export function BrandLogo({ label, showLabel = true, className }: BrandLogoProps) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2", className)}>
      <ShowcaseIcon />
      {showLabel ? (
        <span className="truncate text-xl font-bold tracking-tight text-white">{label}</span>
      ) : null}
    </span>
  );
}
