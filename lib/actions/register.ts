"use server";

import bcrypt from "bcryptjs";
import { getTranslations } from "next-intl/server";

import { authPrisma } from "@/lib/prisma-auth";
import { createRegisterSchema } from "@/lib/validations/create-auth-schemas";

export type RegisterActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function registerUser(
  _prevState: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> {
  const tValidation = await getTranslations("Validation");

  const raw = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    preferredLanguage: formData.get("preferredLanguage"),
  };

  const registerSchema = createRegisterSchema((key) => tValidation(key));
  const parsed = registerSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const email = parsed.data.email.toLowerCase();

  const existingUser = await authPrisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      fieldErrors: {
        email: [tValidation("emailExists")],
      },
    };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  await authPrisma.user.create({
    data: {
      fullName: parsed.data.fullName,
      email,
      passwordHash,
      preferredLanguage: parsed.data.preferredLanguage,
      role: "USER",
    },
  });

  return { success: true };
}
