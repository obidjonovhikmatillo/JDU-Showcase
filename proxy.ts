import createIntlMiddleware from "next-intl/middleware";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authConfig } from "@/auth.config";
import { routing } from "@/i18n/routing";
import { getLocaleFromPathname, stripLocaleFromPathname } from "@/lib/i18n-path";

const intlMiddleware = createIntlMiddleware(routing);
const { auth } = NextAuth(authConfig);

export const proxy = auth((request) => {
  const { pathname } = request.nextUrl;
  const session = request.auth;
  const pathWithoutLocale = stripLocaleFromPathname(pathname);
  const locale = getLocaleFromPathname(pathname);

  if (pathWithoutLocale.startsWith("/profile") && !session?.user?.id) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathWithoutLocale.startsWith("/admin")) {
    if (!session?.user?.id) {
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  return intlMiddleware(request);
});

export default proxy;

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|_vercel|favicon.ico|icon|apple-icon|.*\\..*).*)",
  ],
};
