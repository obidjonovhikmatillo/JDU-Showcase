"use server";

import { getTranslations } from "next-intl/server";

import { auth } from "@/auth";

export type AdminActionAuthResult =
  | {
      ok: true;
      userId: string;
    }
  | {
      ok: false;
      forbidden: true;
      error: string;
    };

export async function requireAdminAction(): Promise<AdminActionAuthResult> {
  const session = await auth();
  const tErrors = await getTranslations("Errors");

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return {
      ok: false,
      forbidden: true,
      error: tErrors("adminRequired"),
    };
  }

  return { ok: true, userId: session.user.id };
}
