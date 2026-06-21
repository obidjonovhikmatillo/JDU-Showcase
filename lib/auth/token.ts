import type { Language, Role } from "@prisma/client";

export type AuthToken = {
  id: string;
  role: Role;
  preferredLanguage: Language;
  fullName: string;
  email?: string | null;
  avatarUrl?: string | null;
  profileHeadline?: string | null;
};

export function toAuthToken(token: Record<string, unknown>): AuthToken {
  return {
    id: String(token.id ?? ""),
    role: token.role as Role,
    preferredLanguage: token.preferredLanguage as Language,
    fullName: String(token.fullName ?? token.name ?? ""),
    email: typeof token.email === "string" ? token.email : null,
    avatarUrl: typeof token.avatarUrl === "string" ? token.avatarUrl : null,
    profileHeadline:
      typeof token.profileHeadline === "string" ? token.profileHeadline : null,
  };
}
