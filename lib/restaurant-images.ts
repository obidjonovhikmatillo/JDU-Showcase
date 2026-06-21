/** Local restaurant images — food & interiors stored in /public/images/restaurants. */

const base = "/images/restaurants";

export const photos = {
  foodBowl: `${base}/food-bowl.jpg`,
  foodSpread: `${base}/food-spread.jpg`,
  pizza: `${base}/pizza.jpg`,
  japaneseFood: `${base}/japanese-food.jpg`,
  cafeInterior: `${base}/cafe-interior.jpg`,
  croissants: `${base}/croissants.jpg`,
  restaurantInterior1: `${base}/restaurant-interior-1.jpg`,
  restaurantInterior2: `${base}/restaurant-interior-2.jpg`,
  kitchen: `${base}/kitchen.jpg`,
  asianRestaurant: `${base}/asian-restaurant.jpg`,
} as const;

export const restaurantImages = {
  "plov-markazi-chorsu": {
    main: photos.foodBowl,
    gallery: [photos.restaurantInterior1, photos.foodSpread, photos.kitchen],
  },
  "afsona-restaurant": {
    main: photos.restaurantInterior2,
    gallery: [photos.foodSpread, photos.asianRestaurant],
  },
  "yapona-mama": {
    main: photos.japaneseFood,
    gallery: [photos.asianRestaurant, photos.foodBowl, photos.kitchen],
  },
  "sakura-sushi-bar": {
    main: photos.asianRestaurant,
    gallery: [photos.japaneseFood, photos.restaurantInterior2],
  },
  "korean-house-tashkent": {
    main: photos.foodSpread,
    gallery: [photos.kitchen, photos.asianRestaurant],
  },
  "istanbul-kebab-palace": {
    main: photos.foodBowl,
    gallery: [photos.foodSpread, photos.restaurantInterior1],
  },
  "trattoria-amici": {
    main: photos.restaurantInterior2,
    gallery: [photos.pizza, photos.foodSpread, photos.restaurantInterior1],
  },
  "bon-european-bistro": {
    main: photos.foodSpread,
    gallery: [photos.restaurantInterior1, photos.restaurantInterior2],
  },
  "evos-fast-food": {
    main: photos.pizza,
    gallery: [photos.foodBowl, photos.foodSpread],
  },
  "lavash-city": {
    main: photos.foodBowl,
    gallery: [photos.foodSpread],
  },
  "coffee-talk-yunusabad": {
    main: photos.cafeInterior,
    gallery: [photos.croissants, photos.restaurantInterior1, photos.kitchen],
  },
  "cinnamon-bakery": {
    main: photos.croissants,
    gallery: [photos.foodBowl, photos.cafeInterior],
  },
} as const;

export const reviewImages = {
  "review-plov-1": photos.foodBowl,
  "review-plov-2": photos.foodSpread,
  "review-afsona-1": photos.foodSpread,
  "review-yapona-1": photos.japaneseFood,
  "review-sakura-1": photos.asianRestaurant,
  "review-sakura-2": photos.japaneseFood,
  "review-istanbul-1": photos.foodBowl,
  "review-trattoria-1": photos.pizza,
  "review-trattoria-2": photos.foodSpread,
  "review-coffee-1": photos.cafeInterior,
  "review-cinnamon-1": photos.croissants,
  "review-korean-1": photos.foodSpread,
} as const;

export function getRestaurantMainImage(slug: string): string {
  const entry = restaurantImages[slug as keyof typeof restaurantImages];
  return entry?.main ?? photos.restaurantInterior1;
}

export function getRestaurantGallery(slug: string): string[] {
  const entry = restaurantImages[slug as keyof typeof restaurantImages];
  return [...(entry?.gallery ?? [photos.restaurantInterior1])];
}

export function getReviewImage(key: keyof typeof reviewImages): string {
  return reviewImages[key];
}

export const FALLBACK_RESTAURANT_IMAGE = photos.restaurantInterior1;
export const FALLBACK_HERO_IMAGE = photos.restaurantInterior2;
