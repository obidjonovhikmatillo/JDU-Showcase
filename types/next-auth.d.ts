import type { Language, Role } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      fullName: string;
      role: Role;
      preferredLanguage: Language;
      avatarUrl?: string | null;
      profileHeadline?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: Role;
    preferredLanguage: Language;
    avatarUrl?: string | null;
    profileHeadline?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    preferredLanguage: Language;
    fullName: string;
    avatarUrl?: string | null;
    profileHeadline?: string | null;
  }
}

export type SessionUpdatePayload = {
  fullName?: string;
  preferredLanguage?: Language;
  avatarUrl?: string | null;
  profileHeadline?: string | null;
};
