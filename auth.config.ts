import type { NextAuthConfig } from "next-auth";

/**
 * Edge/proxy-safe Auth.js configuration.
 * Database providers and credentials validation live in auth.ts only.
 */
export const authConfig = {
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.preferredLanguage = user.preferredLanguage;
        token.fullName = user.name ?? "";
        token.avatarUrl = user.avatarUrl ?? null;
        token.profileHeadline = user.profileHeadline ?? null;
      }

      if (trigger === "update" && session) {
        const updateSession = session as {
          fullName?: string;
          preferredLanguage?: string;
          avatarUrl?: string | null;
          profileHeadline?: string | null;
        };

        if (updateSession.fullName) {
          token.fullName = updateSession.fullName;
        }

        if (updateSession.preferredLanguage) {
          token.preferredLanguage = updateSession.preferredLanguage;
        }

        if (updateSession.avatarUrl !== undefined) {
          token.avatarUrl = updateSession.avatarUrl;
        }

        if (updateSession.profileHeadline !== undefined) {
          token.profileHeadline = updateSession.profileHeadline;
        }
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.role = token.role as typeof session.user.role;
        session.user.preferredLanguage =
          token.preferredLanguage as typeof session.user.preferredLanguage;
        session.user.fullName = String(token.fullName ?? token.name ?? "");
        session.user.name = session.user.fullName;
        session.user.email =
          typeof token.email === "string" ? token.email : session.user.email;
        session.user.avatarUrl =
          typeof token.avatarUrl === "string" ? token.avatarUrl : null;
        session.user.profileHeadline =
          typeof token.profileHeadline === "string"
            ? token.profileHeadline
            : null;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;
