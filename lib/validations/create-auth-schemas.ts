import { z } from "zod";

import { isValidUploadedImageUrl } from "@/lib/uploads/uploaded-image-url";

type TranslateValidation = (key: string) => string;

export function createPasswordSchema(tv: TranslateValidation) {
  return z
    .string()
    .min(8, tv("passwordMin"))
    .regex(/[A-Z]/, tv("passwordUppercase"))
    .regex(/[a-z]/, tv("passwordLowercase"))
    .regex(/[0-9]/, tv("passwordNumber"));
}

export function createRegisterSchema(tv: TranslateValidation) {
  return z
    .object({
      fullName: z.string().trim().min(1, tv("fullNameRequired")),
      email: z.string().trim().email(tv("emailInvalid")),
      password: createPasswordSchema(tv),
      confirmPassword: z.string().min(1, tv("confirmPasswordRequired")),
      preferredLanguage: z.enum(["UZ", "EN", "RU", "JA"]),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: tv("passwordsMismatch"),
      path: ["confirmPassword"],
    });
}

export function createLoginSchema(tv: TranslateValidation) {
  return z.object({
    email: z.string().trim().email(tv("emailInvalid")),
    password: z.string().min(1, tv("passwordRequired")),
  });
}

export function createProfileUpdateSchema(tv: TranslateValidation) {
  return z.object({
    fullName: z.string().trim().min(1, tv("fullNameRequired")),
    profileHeadline: z.string().trim().max(80, tv("profileHeadlineMax")),
    preferredLanguage: z.enum(["UZ", "EN", "RU", "JA"]),
    avatarUrl: z
      .string()
      .trim()
      .refine((value) => value === "" || isValidUploadedImageUrl(value), {
        message: tv("urlInvalid"),
      }),
  });
}

export type RegisterInput = z.infer<ReturnType<typeof createRegisterSchema>>;
export type LoginInput = z.infer<ReturnType<typeof createLoginSchema>>;
export type ProfileUpdateInput = z.infer<
  ReturnType<typeof createProfileUpdateSchema>
>;
