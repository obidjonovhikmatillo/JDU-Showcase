import {
  Compass,
  MapPin,
  MessageSquareQuote,
  PenLine,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const benefitIcons = [Compass, MessageSquareQuote, PenLine, MapPin] as const;
const benefitKeys = ["discover", "reviews", "share", "locations"] as const;

export async function BenefitsSection() {
  const t = await getTranslations("Home.benefits");

  return (
    <section aria-labelledby="benefits-heading" className="border-t border-border pt-12">
      <h2 id="benefits-heading" className="text-[22px] font-semibold text-foreground">
        {t("title")}
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t("subtitle")}</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {benefitKeys.map((key, index) => {
          const Icon = benefitIcons[index];

          return (
            <div key={key} className="surface-card space-y-3 p-5">
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-foreground">
                <Icon className="size-5" aria-hidden />
              </div>
              <h3 className="font-semibold text-foreground">{t(`${key}.title`)}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {t(`${key}.description`)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export async function CtaSection() {
  const t = await getTranslations("Home.cta");

  return (
    <section className="surface-card bg-muted/40 px-6 py-10 text-center sm:px-10">
      <h2 className="text-[22px] font-semibold text-foreground">{t("title")}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {t("description")}
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/register" className={cn(buttonVariants({ size: "lg" }), "rounded-lg px-6")}>
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
