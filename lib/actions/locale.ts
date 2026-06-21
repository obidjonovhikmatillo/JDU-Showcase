"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { isLocale, localeToLanguage } from "@/lib/i18n";

export async function updatePreferredLanguage(locale: string) {
  if (!isLocale(locale)) {
    return;
  }

  const session = await auth();

  if (!session?.user?.id) {
    return;
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { preferredLanguage: localeToLanguage[locale] },
  });
}
