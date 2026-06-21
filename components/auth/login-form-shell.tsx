"use client";

import { Suspense } from "react";
import { useTranslations } from "next-intl";

import { LoginForm } from "@/components/auth/login-form";

function LoginFormFallback() {
  const t = useTranslations("LoginFormShell");

  return (
    <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
      {t("loading")}
    </div>
  );
}

export function LoginFormShell() {
  return (
    <Suspense fallback={<LoginFormFallback />}>
      <LoginForm />
    </Suspense>
  );
}
