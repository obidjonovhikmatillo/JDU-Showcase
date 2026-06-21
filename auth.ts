import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig } from "@/auth.config";
import { findUserWithPasswordByEmail } from "@/lib/prisma-auth";
import { loginSchema } from "@/lib/validations/auth";

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  ...authConfig,
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
});
