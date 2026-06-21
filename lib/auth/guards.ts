import { getLocale } from "next-intl/server";

import { auth } from "@/auth";
import { redirect } from "@/i18n/navigation";
import type { Session } from "next-auth";

function buildCallbackUrl(locale: string, callbackPath: string) {
  const normalizedPath = callbackPath.startsWith("/")
    ? callbackPath
    : `/${callbackPath}`;

  return `/${locale}${normalizedPath === "/" ? "" : normalizedPath}`;
}

type AuthenticatedSession = Session & {
  user: NonNullable<Session["user"]> & { id: string };
};

export async function requireAuth(
  callbackPath = "/profile",
): Promise<AuthenticatedSession> {
  const session = await auth();

  if (!session?.user?.id) {
    const locale = await getLocale();
    const callbackUrl = buildCallbackUrl(locale, callbackPath);

    redirect({
      href: {
        pathname: "/login",
        query: { callbackUrl },
      },
      locale,
    });
  }

  return session as AuthenticatedSession;
}

export async function requireAdmin(): Promise<AuthenticatedSession> {
  const session = await requireAuth("/admin");

  if (session.user.role !== "ADMIN") {
    const locale = await getLocale();
    redirect({ href: "/", locale });
  }

  return session;
}

export async function redirectIfAuthenticated(destination = "/profile") {
  const session = await auth();

  if (session?.user?.id) {
    const locale = await getLocale();
    redirect({ href: destination, locale });
  }
}
