import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { LoginFormShell } from "@/components/auth/login-form-shell";
import { AuthPageShell } from "@/components/layout/auth-page-shell";
import { redirectIfAuthenticated } from "@/lib/auth/guards";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("LoginPage");

  return {
    title: t("title"),
  };
}

export default async function LoginPage() {
  await redirectIfAuthenticated();
  const t = await getTranslations("LoginPage");

  return (
    <AuthPageShell title={t("title")} subtitle={t("subtitle")}>
      <LoginFormShell />
    </AuthPageShell>
  );
}
