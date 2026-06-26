import { z } from "zod";

type TranslateValidation = (key: string) => string;

function sharedProjectFields(tv: TranslateValidation) {
  return {
    title: z.string().trim().min(1, tv("projectTitleRequired")),
    slug: z
      .string()
      .trim()
      .min(1, tv("projectSlugRequired"))
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, tv("projectSlugInvalid")),
    description: z.string().trim().min(1, tv("descriptionRequired")),
    authorName: z.string().trim().min(1, tv("authorNameRequired")),
    department: z.string().trim().min(1, tv("departmentRequired")),
    demoUrl: z
      .string()
      .trim()
      .optional()
      .refine((value) => !value || z.string().url().safeParse(value).success, {
        message: tv("urlInvalid"),
      }),
    githubUrl: z
      .string()
      .trim()
      .optional()
      .refine((value) => !value || z.string().url().safeParse(value).success, {
        message: tv("urlInvalid"),
      }),
    techStack: z.string().trim().optional(),
    difficulty: z.string().trim().optional(),
    categoryId: z.string().trim().min(1, tv("categoryRequired")),
    isPublished: z.boolean(),
  };
}

function formProjectFields(tv: TranslateValidation) {
  return {
    ...sharedProjectFields(tv),
  };
}

function serverProjectFields(tv: TranslateValidation) {
  return {
    ...sharedProjectFields(tv),
  };
}

export function createAdminProjectFormSchema(tv: TranslateValidation) {
  return z.object(formProjectFields(tv));
}

export function createAdminProjectSchema(tv: TranslateValidation) {
  return z.object(serverProjectFields(tv)).transform((data) => {
    const { description, ...rest } = data;

    return {
      ...rest,
      descriptionUz: description,
      descriptionEn: description,
      descriptionRu: description,
      descriptionJa: description,
    };
  });
}

export function createAdminProjectUpdateSchema(tv: TranslateValidation) {
  return z
    .object({
      projectId: z.string().trim().min(1, tv("projectRequired")),
      ...serverProjectFields(tv),
    })
    .transform((data) => {
      const { description, ...rest } = data;

      return {
        ...rest,
        descriptionUz: description,
        descriptionEn: description,
        descriptionRu: description,
        descriptionJa: description,
      };
    });
}

export function createAdminProjectDeleteSchema(tv: TranslateValidation) {
  return z.object({
    projectId: z.string().trim().min(1, tv("projectRequired")),
  });
}

export function createAdminProjectPublishSchema(tv: TranslateValidation) {
  return z.object({
    projectId: z.string().trim().min(1, tv("projectRequired")),
    isPublished: z.coerce.boolean(),
  });
}

export type AdminProjectFormInput = z.infer<
  ReturnType<typeof createAdminProjectFormSchema>
>;
export type AdminProjectInput = z.output<
  ReturnType<typeof createAdminProjectSchema>
>;
