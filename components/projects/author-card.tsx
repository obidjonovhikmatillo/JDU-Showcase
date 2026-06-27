import { GlobeIcon, MailIcon, PhoneIcon, UserIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AuthorCardProps = {
  authorName: string;
  department: string;
};

export async function AuthorCard({ authorName, department }: AuthorCardProps) {
  const t = await getTranslations("ProjectDetail");

  const slug = authorName.toLowerCase().replace(/\s+/g, ".");
  const email = `${slug}@jdu.uz`;
  const phone = "+998 90 123 45 67";
  const website = "jdu.uz";

  return (
    <section className="border-t border-border pt-10">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-24 items-center justify-center rounded-full bg-primary/10">
          <UserIcon className="size-12 text-primary" aria-hidden />
        </div>
        <h3 className="mt-4 text-xl font-bold text-foreground">{authorName}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{department}</p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MailIcon className="size-3.5" aria-hidden />
            {email}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <PhoneIcon className="size-3.5" aria-hidden />
            {phone}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <GlobeIcon className="size-3.5" aria-hidden />
            {website}
          </span>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full px-8",
            )}
          >
            <MailIcon className="mr-2 size-4" aria-hidden />
            {t("getInTouch")}
          </button>
        </div>
      </div>
    </section>
  );
}
