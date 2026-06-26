import { SearchXIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { EmptyState } from "@/components/ui/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export default async function NotFoundPage() {
  const t = await getTranslations("NotFound");

  return (
    <EmptyState
      icon={<SearchXIcon className="size-6" aria-hidden />}
      title={t("title")}
      description={t("description")}
      action={
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href="/" className={cn(buttonVariants({ size: "lg" }))}>
            {t("backHome")}
          </Link>
          <Link
            href="/projects"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
          >
            {t("browseProjects")}
          </Link>
        </div>
      }
    />
  );
}
