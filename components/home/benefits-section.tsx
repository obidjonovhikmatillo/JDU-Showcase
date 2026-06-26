import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export async function CtaSection() {
  const t = await getTranslations("Home.cta");

  return (
    <section className="rounded-2xl bg-muted/40 px-6 py-12 text-center sm:px-10 sm:py-16">
      <h2 className="text-2xl font-bold text-foreground sm:text-3xl">{t("title")}</h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        {t("description")}
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8")}>
          {t("button")}
        </Link>
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "ghost", size: "lg" }),
            "font-semibold underline-offset-4 hover:underline",
          )}
        >
          {t("login")}
        </Link>
      </div>
    </section>
  );
}
