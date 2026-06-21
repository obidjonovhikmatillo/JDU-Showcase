"use client";

import { Loader2Icon, LogOutIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  compact?: boolean;
  className?: string;
};

export function LogoutButton({ compact = false, className }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const locale = useLocale();
  const t = useTranslations("Nav");
  const tToast = useTranslations("Toast");

  async function handleLogout() {
    setIsLoading(true);

    try {
      await signOut({ callbackUrl: `/${locale}` });
      toast.success(tToast("signedOut"));
    } catch {
      toast.error(tToast("signOutFailed"));
      setIsLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant={compact ? "ghost" : "outline"}
      size={compact ? "icon-sm" : "sm"}
      onClick={handleLogout}
      disabled={isLoading}
      className={cn(compact && "rounded-full text-muted-foreground", className)}
      aria-label={t("signOut")}
    >
      {isLoading ? (
        <Loader2Icon className="size-4 animate-spin" aria-hidden />
      ) : (
        <LogOutIcon className="size-4" aria-hidden />
      )}
      {compact ? null : t("signOut")}
    </Button>
  );
}
