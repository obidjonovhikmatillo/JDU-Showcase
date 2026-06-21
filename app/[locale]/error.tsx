"use client";

import { AlertTriangleIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { EmptyState } from "@/components/ui/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Errors");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <EmptyState
      variant="error"
      icon={<AlertTriangleIcon className="size-6" aria-hidden />}
      title={t("title")}
      description={t("description")}
      action={
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className={cn(buttonVariants())}
          >
            {t("retry")}
          </button>
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
            {t("backHome")}
          </Link>
        </div>
      }
    />
  );
}
