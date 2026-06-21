import { z } from "zod";

type TranslateValidation = (key: string) => string;

export function createAdminUserStatusSchema(tv: TranslateValidation) {
  return z.object({
    userId: z.string().trim().min(1, tv("userRequired")),
    isActive: z.coerce.boolean(),
  });
}

export function createAdminUserRoleSchema(tv: TranslateValidation) {
  return z.object({
    userId: z.string().trim().min(1, tv("userRequired")),
    role: z.enum(["USER", "ADMIN"], { message: tv("roleInvalid") }),
  });
}

export type AdminUserStatusInput = z.infer<ReturnType<typeof createAdminUserStatusSchema>>;
