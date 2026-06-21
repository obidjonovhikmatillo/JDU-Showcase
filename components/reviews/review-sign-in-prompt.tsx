import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ReviewSignInPromptProps = {
  restaurantSlug: string;
};

export async function ReviewSignInPrompt({ restaurantSlug }: ReviewSignInPromptProps) {
  const t = await getTranslations("ReviewForm");
  const locale = await getLocale();
  const callbackUrl = `/${locale}/restaurants/${restaurantSlug}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("signInTitle")}</CardTitle>
        <CardDescription>{t("signInDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          href={{
            pathname: "/login",
            query: { callbackUrl },
          }}
          className={cn(buttonVariants())}
        >
          {t("signInButton")}
        </Link>
      </CardContent>
    </Card>
  );
}
