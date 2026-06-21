export type ReviewAuthor = {
  id: string;
  fullName: string;
  avatarUrl: string | null;
};

export type ReviewImageRecord = {
  id: string;
  imageUrl: string;
  publicId: string | null;
};

export type RestaurantImageRecord = {
  id: string;
  imageUrl: string;
  publicId: string | null;
};

export type ReviewRecord = {
  id: string;
  rating: number;
  title: string;
  content: string;
  visitDate: Date | null;
  createdAt: Date;
  user: ReviewAuthor;
  images: ReviewImageRecord[];
};

export type RestaurantDetailRecord = {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  phone: string | null;
  website: string | null;
  openingHours: string | null;
  mainImageUrl: string | null;
  mainImagePublicId: string | null;
  galleryImages: RestaurantImageRecord[];
  priceLevel: number | null;
  cuisineType: string | null;
  category: {
    id: string;
    slug: string;
    nameUz: string;
    nameEn: string;
    nameRu: string;
    nameJa: string;
  };
  averageRating: number | null;
  reviewCount: number;
  reviews: ReviewRecord[];
};
