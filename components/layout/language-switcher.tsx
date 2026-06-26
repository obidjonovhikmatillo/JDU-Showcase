"use client";

import { Globe } from "lucide-react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/navigation";
import { updatePreferredLanguage } from "@/lib/actions/locale";
import { localeCodes, localeLabels, locales, localeToLanguage, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const currentLocale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, update } = useSession();
  const t = useTranslations("LanguageSwitcher");
  const [isPending, startTransition] = useTransition();

  function handleLocaleChange(nextLocale: Locale) {
    if (nextLocale === currentLocale) {
      return;
    }

    startTransition(async () => {
      if (session?.user?.id) {
        await updatePreferredLanguage(nextLocale);
        await update({ preferredLanguage: localeToLanguage[nextLocale] });
      }

      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isPending}
        aria-label={t("ariaLabel")}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "min-w-14 gap-1 rounded-full border-white/20 bg-transparent px-2.5 font-medium text-white/80 hover:bg-white/10 hover:text-white",
        )}
      >
        <Globe className="size-3.5 shrink-0" aria-hidden />
        <span>{localeCodes[currentLocale]}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={currentLocale}
          onValueChange={(value) => handleLocaleChange(value as Locale)}
        >
          {locales.map((locale) => (
            <DropdownMenuRadioItem key={locale} value={locale} className="font-medium">
              {localeLabels[locale]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
