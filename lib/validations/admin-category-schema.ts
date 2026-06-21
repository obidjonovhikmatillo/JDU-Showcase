import { z } from "zod";

type TranslateValidation = (key: string) => string;

export function createAdminCategorySchema(tv: TranslateValidation) {
  return z.object({
    nameUz: z.string().trim().min(1, tv("categoryNameRequired")),
    nameEn: z.string().trim().min(1, tv("categoryNameRequired")),
    nameRu: z.string().trim().min(1, tv("categoryNameRequired")),
    nameJa: z.string().trim().min(1, tv("categoryNameRequired")),
    slug: z
      .string()
      .trim()
      .min(1, tv("categorySlugRequired"))
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, tv("categorySlugInvalid")),
  });
}

export function createAdminCategoryUpdateSchema(tv: TranslateValidation) {
  return createAdminCategorySchema(tv).extend({
    categoryId: z.string().trim().min(1, tv("categoryRequired")),
  });
}

export function createAdminCategoryDeleteSchema(tv: TranslateValidation) {
  return z.object({
    categoryId: z.string().trim().min(1, tv("categoryRequired")),
  });
}

export type AdminCategoryInput = z.infer<ReturnType<typeof createAdminCategorySchema>>;
