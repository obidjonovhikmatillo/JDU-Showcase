import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { RegisterForm } from "@/components/auth/register-form";
import { AuthPageShell } from "@/components/layout/auth-page-shell";
import { redirectIfAuthenticated } from "@/lib/auth/guards";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("RegisterPage");

  return {
    title: t("title"),
  };
}

export default async function RegisterPage() {
  await redirectIfAuthenticated();
  const t = await getTranslations("RegisterPage");

  return (
    <AuthPageShell title={t("title")} subtitle={t("subtitle")}>
      <RegisterForm />
    </AuthPageShell>
  );
}
