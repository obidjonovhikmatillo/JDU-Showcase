import { z } from "zod";

type TranslateValidation = (key: string) => string;

function sharedRestaurantFields(tv: TranslateValidation) {
  return {
    name: z.string().trim().min(1, tv("restaurantNameRequired")),
    slug: z
      .string()
      .trim()
      .min(1, tv("restaurantSlugRequired"))
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, tv("restaurantSlugInvalid")),
    description: z.string().trim().min(1, tv("descriptionRequired")),
    address: z.string().trim().min(1, tv("addressRequired")),
    city: z.string().trim().min(1, tv("cityRequired")),
    phone: z.string().trim().optional(),
    website: z
      .string()
      .trim()
      .optional()
      .refine((value) => !value || z.string().url().safeParse(value).success, {
        message: tv("urlInvalid"),
      }),
    openingHours: z.string().trim().optional(),
    cuisineType: z.string().trim().optional(),
    categoryId: z.string().trim().min(1, tv("categoryRequired")),
    isPublished: z.boolean(),
  };
}

function formRestaurantFields(tv: TranslateValidation) {
  return {
    ...sharedRestaurantFields(tv),
    latitude: z
      .number({ message: tv("latitudeInvalid") })
      .min(-90, tv("latitudeInvalid"))
      .max(90, tv("latitudeInvalid")),
    longitude: z
      .number({ message: tv("longitudeInvalid") })
      .min(-180, tv("longitudeInvalid"))
      .max(180, tv("longitudeInvalid")),
    priceLevel: z
      .number()
      .int(tv("priceLevelInvalid"))
      .min(1, tv("priceLevelInvalid"))
      .max(4, tv("priceLevelInvalid"))
      .optional(),
  };
}

function serverRestaurantFields(tv: TranslateValidation) {
  return {
    ...sharedRestaurantFields(tv),
    latitude: z.coerce
      .number({ message: tv("latitudeInvalid") })
      .min(-90, tv("latitudeInvalid"))
      .max(90, tv("latitudeInvalid")),
    longitude: z.coerce
      .number({ message: tv("longitudeInvalid") })
      .min(-180, tv("longitudeInvalid"))
      .max(180, tv("longitudeInvalid")),
    priceLevel: z.preprocess(
      (value) => {
        if (
          value === "" ||
          value === null ||
          value === undefined ||
          (typeof value === "number" && Number.isNaN(value))
        ) {
          return null;
        }
        return Number(value);
      },
      z
        .number()
        .int(tv("priceLevelInvalid"))
        .min(1, tv("priceLevelInvalid"))
        .max(4, tv("priceLevelInvalid"))
        .nullable()
        .optional(),
    ),
  };
}

export function createAdminRestaurantFormSchema(tv: TranslateValidation) {
  return z.object(formRestaurantFields(tv));
}

export function createAdminRestaurantSchema(tv: TranslateValidation) {
  return z.object(serverRestaurantFields(tv)).transform((data) => {
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

export function createAdminRestaurantUpdateSchema(tv: TranslateValidation) {
  return z
    .object({
      restaurantId: z.string().trim().min(1, tv("restaurantRequired")),
      ...serverRestaurantFields(tv),
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

export function createAdminRestaurantDeleteSchema(tv: TranslateValidation) {
  return z.object({
    restaurantId: z.string().trim().min(1, tv("restaurantRequired")),
  });
}

export function createAdminRestaurantPublishSchema(tv: TranslateValidation) {
  return z.object({
    restaurantId: z.string().trim().min(1, tv("restaurantRequired")),
    isPublished: z.coerce.boolean(),
  });
}

export type AdminRestaurantFormInput = z.infer<
  ReturnType<typeof createAdminRestaurantFormSchema>
>;
export type AdminRestaurantInput = z.output<
  ReturnType<typeof createAdminRestaurantSchema>
>;
