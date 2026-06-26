"use client";

import { AlertCircleIcon, RefreshCwIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export function ProjectsErrorState() {
  const t = useTranslations("Projects.error");

  return (
    <EmptyState
      variant="error"
      icon={<AlertCircleIcon className="size-6" aria-hidden />}
      title={t("title")}
      description={t("description")}
      action={
        <Button type="button" variant="outline" size="lg" onClick={() => window.location.reload()}>
          <RefreshCwIcon className="size-4" aria-hidden />
          {t("retry")}
        </Button>
      }
    />
  );
}
