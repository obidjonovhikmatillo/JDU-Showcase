import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { findUserWithPasswordByEmail } from "@/lib/prisma-auth";
import { toAuthToken } from "@/lib/auth/token";
import { loginSchema } from "@/lib/validations/auth";
import type { SessionUpdatePayload } from "@/types/next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const email = parsed.data.email.toLowerCase();
        const user = await findUserWithPasswordByEmail(email);

        if (!user?.isActive) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash,
        );

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
          preferredLanguage: user.preferredLanguage,
          avatarUrl: user.avatarUrl,
          profileHeadline:
            "profileHeadline" in user
              ? (user.profileHeadline as string | null | undefined) ?? null
              : null,
        };
      },
    }),
  ],
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
        const updateSession = session as SessionUpdatePayload;

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
        const authToken = toAuthToken(token as Record<string, unknown>);

        session.user.id = authToken.id;
        session.user.role = authToken.role;
        session.user.preferredLanguage = authToken.preferredLanguage;
        session.user.fullName = authToken.fullName;
        session.user.name = authToken.fullName;
        session.user.email = authToken.email ?? session.user.email;
        session.user.avatarUrl = authToken.avatarUrl ?? null;
        session.user.profileHeadline = authToken.profileHeadline ?? null;
      }

      return session;
    },
  },
});
