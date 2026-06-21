"use client";

import { AlertCircleIcon, RefreshCwIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

type HomeErrorStateProps = {
  onRetry?: () => void;
};

export function HomeErrorState({ onRetry }: HomeErrorStateProps) {
  const t = useTranslations("Home.error");

  return (
    <EmptyState
      variant="error"
      icon={<AlertCircleIcon className="size-6" aria-hidden />}
      title={t("title")}
      description={t("description")}
      action={
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => (onRetry ? onRetry() : window.location.reload())}
        >
          <RefreshCwIcon className="size-4" aria-hidden />
          {t("retry")}
        </Button>
      }
    />
  );
}
