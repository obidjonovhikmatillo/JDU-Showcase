export type CategoryRecord = {
  id: string;
  nameUz: string;
  nameEn: string;
  nameRu: string;
  nameJa: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CategoryWithCount = CategoryRecord & {
  restaurantCount: number;
};

export type RestaurantSummary = {
  id: string;
  name: string;
  slug: string;
  mainImageUrl: string | null;
  address: string;
  city: string;
  cuisineType: string | null;
  priceLevel: number | null;
  category: CategoryRecord;
  averageRating: number | null;
  reviewCount: number;
  createdAt: Date;
};
