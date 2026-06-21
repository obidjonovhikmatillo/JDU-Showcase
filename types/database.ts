import type { Language, Role, User } from "@prisma/client";

export type { Language, Role };

/** User record without sensitive authentication fields. */
export type SafeUser = Omit<User, "passwordHash">;

export const ROLES = ["USER", "ADMIN"] as const satisfies readonly Role[];

export const LANGUAGES = ["UZ", "EN", "RU", "JA"] as const satisfies readonly Language[];
