export type CategorySeed = {
  slug: string;
  nameUz: string;
  nameEn: string;
  nameRu: string;
  nameJa: string;
};

export type RestaurantSeed = {
  slug: string;
  name: string;
  descriptionUz: string;
  descriptionEn: string;
  descriptionRu: string;
  descriptionJa: string;
  address: string;
  city: string;
  phone: string;
  website?: string;
  openingHours: string;
  latitude: number;
  longitude: number;
  mainImageUrl: string;
  galleryImageUrls: string[];
  categorySlug: string;
  priceLevel: number;
  cuisineType: string;
  isPublished: boolean;
};

export type ReviewSeed = {
  userEmail: string;
  restaurantSlug: string;
  rating: number;
  title: string;
  content: string;
  visitDate?: string;
  imageUrls?: string[];
};

export type UserSeed = {
  email: string;
  fullName: string;
  password: string;
  role: "USER" | "ADMIN";
  preferredLanguage: "UZ" | "EN" | "RU" | "JA";
};

import {
  getRestaurantGallery,
  getRestaurantMainImage,
  getReviewImage,
} from "../lib/restaurant-images";

export const users: UserSeed[] = [
  {
    email: "admin@example.com",
    fullName: "Sardor Alimov",
    password: "Admin123!",
    role: "ADMIN",
    preferredLanguage: "UZ",
  },
  {
    email: "user@example.com",
    fullName: "Dilnoza Karimova",
    password: "User123!",
    role: "USER",
    preferredLanguage: "UZ",
  },
  {
    email: "aziza@example.com",
    fullName: "Aziza Rakhimova",
    password: "User123!",
    role: "USER",
    preferredLanguage: "RU",
  },
  {
    email: "kenji@example.com",
    fullName: "Kenji Tanaka",
    password: "User123!",
    role: "USER",
    preferredLanguage: "JA",
  },
];

export const categories: CategorySeed[] = [
  {
    slug: "uzbek-cuisine",
    nameUz: "O'zbek taomlari",
    nameEn: "Uzbek cuisine",
    nameRu: "Узбекская кухня",
    nameJa: "ウズベク料理",
  },
  {
    slug: "japanese-cuisine",
    nameUz: "Yapon taomlari",
    nameEn: "Japanese cuisine",
    nameRu: "Японская кухня",
    nameJa: "日本料理",
  },
  {
    slug: "korean-cuisine",
    nameUz: "Koreys taomlari",
    nameEn: "Korean cuisine",
    nameRu: "Корейская кухня",
    nameJa: "韓国料理",
  },
  {
    slug: "turkish-cuisine",
    nameUz: "Turk taomlari",
    nameEn: "Turkish cuisine",
    nameRu: "Турецкая кухня",
    nameJa: "トルコ料理",
  },
  {
    slug: "european-cuisine",
    nameUz: "Yevropa taomlari",
    nameEn: "European cuisine",
    nameRu: "Европейская кухня",
    nameJa: "ヨーロッパ料理",
  },
  {
    slug: "fast-food",
    nameUz: "Tez tayyor taomlar",
    nameEn: "Fast food",
    nameRu: "Фастфуд",
    nameJa: "ファストフード",
  },
  {
    slug: "coffee-shop",
    nameUz: "Kofe uyi",
    nameEn: "Coffee shop",
    nameRu: "Кофейня",
    nameJa: "カフェ",
  },
  {
    slug: "dessert",
    nameUz: "Shirinliklar",
    nameEn: "Dessert",
    nameRu: "Десерты",
    nameJa: "デザート",
  },
];

export const restaurants: RestaurantSeed[] = [
  {
    slug: "plov-markazi-chorsu",
    name: "Plov Markazi Chorsu",
    descriptionUz:
      "Chorsu bozoridagi afsonaviy osh markazi. Toshkent uslubidagi qizil va sariq osh, nozik qovurma va issiq non har kuni ertalab tayyorlanadi.",
    descriptionEn:
      "Legendary plov house near Chorsu Bazaar serving classic Tashkent-style red and yellow rice with tender meat and fresh tandoor bread baked every morning.",
    descriptionRu:
      "Легендарная пловная у базара Чорсу с классическим ташкентским пловом, нежным мясом и свежим лепёшками из тандыра каждое утро.",
    descriptionJa:
      "チャルスバザール近くの名物プラウ店。タシケント風の赤と黄のピラフ、柔らかい肉、毎朝焼きたてのナンが人気です。",
    address: "Chorsu Bazaar, 9 Beruni Avenue",
    city: "Tashkent",
    phone: "+998 71 244 12 34",
    openingHours: "Mon–Sun 08:00–22:00",
    latitude: 41.3264,
    longitude: 69.2341,
    mainImageUrl: getRestaurantMainImage("plov-markazi-chorsu"),
    galleryImageUrls: getRestaurantGallery("plov-markazi-chorsu"),
    categorySlug: "uzbek-cuisine",
    priceLevel: 2,
    cuisineType: "Uzbek",
    isPublished: true,
  },
  {
    slug: "afsona-restaurant",
    name: "Afsona Restaurant",
    descriptionUz:
      "Milliy taomlar va zamonaviy interyer uyg'unligi. Manti, somsa va shirinliklar oilaviy kechalar uchun juda mos.",
    descriptionEn:
      "A refined blend of national dishes and modern interiors. Manti, samsa, and desserts make it ideal for family evenings in central Tashkent.",
    descriptionRu:
      "Изысканное сочетание национальных блюд и современного интерьера. Манты, самса и десерты отлично подходят для семейных вечеров.",
    descriptionJa:
      "民族料理とモダンな内装が調和したレストラン。マンティ、サムサ、デザートが家族での夕食に最適です。",
    address: "28 Navoi Street",
    city: "Tashkent",
    phone: "+998 71 233 45 67",
    website: "https://example.com/afsona",
    openingHours: "Mon–Sun 11:00–23:00",
    latitude: 41.3118,
    longitude: 69.2794,
    mainImageUrl: getRestaurantMainImage("afsona-restaurant"),
    galleryImageUrls: getRestaurantGallery("afsona-restaurant"),
    categorySlug: "uzbek-cuisine",
    priceLevel: 3,
    cuisineType: "Uzbek",
    isPublished: true,
  },
  {
    slug: "yapona-mama",
    name: "Yapona Mama",
    descriptionUz:
      "Toshkentdagi mashhur yapon restorani. Rollar, ramen va tempura katta tanlov bilan taqdim etiladi.",
    descriptionEn:
      "Popular Japanese restaurant in Tashkent known for sushi rolls, ramen, and crispy tempura served in a lively downtown setting.",
    descriptionRu:
      "Популярный японский ресторан в Ташкенте с суши-роллами, раменом и хрустящим темпура в оживлённом центре города.",
    descriptionJa:
      "タシケントで人気の日本食レストラン。巻き寿司、ラーメン、サクサクの天ぷらが楽しめます。",
    address: "45 Amir Temur Avenue",
    city: "Tashkent",
    phone: "+998 71 255 88 11",
    openingHours: "Mon–Sun 12:00–00:00",
    latitude: 41.3193,
    longitude: 69.2517,
    mainImageUrl: getRestaurantMainImage("yapona-mama"),
    galleryImageUrls: getRestaurantGallery("yapona-mama"),
    categorySlug: "japanese-cuisine",
    priceLevel: 3,
    cuisineType: "Japanese",
    isPublished: true,
  },
  {
    slug: "sakura-sushi-bar",
    name: "Sakura Sushi Bar",
    descriptionUz:
      "Yengil yapon taomlari va premium sushi setlar. Ishdan keyin tinch kechki ovqat uchun qulay joy.",
    descriptionEn:
      "Light Japanese fare and premium sushi sets in a calm atmosphere, perfect for relaxed dinners after work near Yunusabad.",
    descriptionRu:
      "Лёгкие японские блюда и премиальные суши-сеты в спокойной атмосфере — отличный выбор для ужина после работы.",
    descriptionJa:
      "ユンサバード近くの落ち着いた寿司バー。仕事帰りのディナーに最適な軽めの日本料理とプレミアム寿司セット。",
    address: "12 Babur Street, Yunusabad",
    city: "Tashkent",
    phone: "+998 71 266 33 22",
    openingHours: "Mon–Sun 11:00–23:00",
    latitude: 41.3349,
    longitude: 69.2885,
    mainImageUrl: getRestaurantMainImage("sakura-sushi-bar"),
    galleryImageUrls: getRestaurantGallery("sakura-sushi-bar"),
    categorySlug: "japanese-cuisine",
    priceLevel: 4,
    cuisineType: "Japanese",
    isPublished: true,
  },
  {
    slug: "korean-house-tashkent",
    name: "Korean House Tashkent",
    descriptionUz:
      "Koreys barbekyu va kimchi bilan boy stollar. Guruh uchun BBQ kechasi va qiziqarli xizmat.",
    descriptionEn:
      "Korean BBQ with generous banchan side dishes and kimchi. A fun group dining spot for grilled meat and shared plates.",
    descriptionRu:
      "Корейское барбекю с щедрыми гарнирами и кимчи. Отличное место для компании с жареным мясом и общими блюдами.",
    descriptionJa:
      "キムチと豊富なおかず付きの韓国焼肉店。グループで楽しめるBBQディナーにぴったりです。",
    address: "7 Shahrisabz Street",
    city: "Tashkent",
    phone: "+998 71 277 19 90",
    openingHours: "Mon–Sun 12:00–23:30",
    latitude: 41.3089,
    longitude: 69.2654,
    mainImageUrl: getRestaurantMainImage("korean-house-tashkent"),
    galleryImageUrls: getRestaurantGallery("korean-house-tashkent"),
    categorySlug: "korean-cuisine",
    priceLevel: 3,
    cuisineType: "Korean",
    isPublished: true,
  },
  {
    slug: "istanbul-kebab-palace",
    name: "Istanbul Kebab Palace",
    descriptionUz:
      "Doner, lavash va turkcha nonushta taomlari. Tez, to'yimli va oilaviy narxlar bilan mashhur.",
    descriptionEn:
      "Doner, lavash wraps, and Turkish breakfast plates. Known for fast service, hearty portions, and family-friendly prices.",
    descriptionRu:
      "Донер, лаваш и турецкий завтрак. Славится быстрым обслуживанием, сытными порциями и доступными ценами.",
    descriptionJa:
      "ドネルケバブ、ラヴァシュ、トルコ式朝食が楽しめるお店。早いサービスとボリューム満点の料理が人気です。",
    address: "33 Farabi Street",
    city: "Tashkent",
    phone: "+998 71 288 44 55",
    openingHours: "Mon–Sun 09:00–23:00",
    latitude: 41.2956,
    longitude: 69.2788,
    mainImageUrl: getRestaurantMainImage("istanbul-kebab-palace"),
    galleryImageUrls: getRestaurantGallery("istanbul-kebab-palace"),
    categorySlug: "turkish-cuisine",
    priceLevel: 2,
    cuisineType: "Turkish",
    isPublished: true,
  },
  {
    slug: "trattoria-amici",
    name: "Trattoria Amici",
    descriptionUz:
      "Italyan makaron, pizza va tiramisu. Romantik kechalar va biznes tushliklari uchun qulay atmosfera.",
    descriptionEn:
      "Italian pasta, wood-fired pizza, and tiramisu in an elegant setting suited for romantic dinners and business lunches.",
    descriptionRu:
      "Итальянская паста, пицца и тирамisu в элегантной обстановке — подходит для романтических ужинов и деловых ланчей.",
    descriptionJa:
      "パスタ、薪窯ピッツァ、ティラミスが楽しめるイタリアンレストラン。デートやビジネスランチに最適です。",
    address: "5 Sayilgoh Street",
    city: "Tashkent",
    phone: "+998 71 299 11 77",
    openingHours: "Mon–Sun 11:30–23:00",
    latitude: 41.3127,
    longitude: 69.2721,
    mainImageUrl: getRestaurantMainImage("trattoria-amici"),
    galleryImageUrls: getRestaurantGallery("trattoria-amici"),
    categorySlug: "european-cuisine",
    priceLevel: 4,
    cuisineType: "Italian",
    isPublished: true,
  },
  {
    slug: "bon-european-bistro",
    name: "Bon! European Bistro",
    descriptionUz:
      "Yevropa bistro taomlari, steak va yengil salatlar. Mirzo Ulug'bek hududidagi zamonaviy restoran.",
    descriptionEn:
      "European bistro classics, steaks, and fresh salads in a contemporary venue in the Mirzo Ulugbek district.",
    descriptionRu:
      "Европейские блюда бistro, стейки и свежие салаты в современном ресторане района Мирzo Ulugbek.",
    descriptionJa:
      "ミルズォ・ウルグベク地区のモダンなビストロ。欧風料理、ステーキ、新鮮なサラダが楽しめます。",
    address: "18 Buyuk Ipak Yoli, Mirzo Ulugbek",
    city: "Tashkent",
    phone: "+998 71 244 90 01",
    openingHours: "Mon–Sun 10:00–22:30",
    latitude: 41.3412,
    longitude: 69.3348,
    mainImageUrl: getRestaurantMainImage("bon-european-bistro"),
    galleryImageUrls: getRestaurantGallery("bon-european-bistro"),
    categorySlug: "european-cuisine",
    priceLevel: 3,
    cuisineType: "European",
    isPublished: true,
  },
  {
    slug: "evos-fast-food",
    name: "Evos Tashkent",
    descriptionUz:
      "Mahalliy fast food zanjiri. Lavash, burger va kartoshka fri tez va barqaror sifat bilan tayyorlanadi.",
    descriptionEn:
      "Well-known local fast food chain offering lavash, burgers, and fries with consistent quality and quick takeaway service.",
    descriptionRu:
      "Известная местная сеть фастфуда с лавашом, бургерами и картофелем фри — быстро и стабильно по качеству.",
    descriptionJa:
      "地元で有名なファストフードチェーン。ラヴァシュ、バーガー、フライドポテトを素早く提供します。",
    address: "102 Bunyodkor Avenue",
    city: "Tashkent",
    phone: "+998 71 200 33 44",
    openingHours: "Mon–Sun 09:00–23:00",
    latitude: 41.2867,
    longitude: 69.2034,
    mainImageUrl: getRestaurantMainImage("evos-fast-food"),
    galleryImageUrls: getRestaurantGallery("evos-fast-food"),
    categorySlug: "fast-food",
    priceLevel: 1,
    cuisineType: "Fast food",
    isPublished: true,
  },
  {
    slug: "lavash-city",
    name: "Lavash City",
    descriptionUz:
      "Katta lavashlar, shaurma va combo menyu. Talabalar va ofis xodimlari orasida mashhur.",
    descriptionEn:
      "Oversized lavash wraps, shawarma, and combo menus popular with students and office workers near Tashkent State University.",
    descriptionRu:
      "Большие лаваши, шаурма и комбо-меню — популярно среди студентов и офисных работников рядом с ТГУ.",
    descriptionJa:
      "タシケント国立大学近くで学生や会社員に人気。大きなラヴァシュ、シャワルマ、コンボメニューが評判です。",
    address: "14 University Street",
    city: "Tashkent",
    phone: "+998 71 211 55 66",
    openingHours: "Mon–Sun 08:30–22:00",
    latitude: 41.3381,
    longitude: 69.2402,
    mainImageUrl: getRestaurantMainImage("lavash-city"),
    galleryImageUrls: getRestaurantGallery("lavash-city"),
    categorySlug: "fast-food",
    priceLevel: 1,
    cuisineType: "Fast food",
    isPublished: true,
  },
  {
    slug: "coffee-talk-yunusabad",
    name: "Coffee & Talk",
    descriptionUz:
      "Specialty kofe, kold brew va yengil brunch. Wi-Fi va tinch muhit bilan ishlaydiganlar uchun ideal.",
    descriptionEn:
      "Specialty coffee, cold brew, and light brunch in a quiet Wi-Fi friendly space ideal for remote work in Yunusabad.",
    descriptionRu:
      "Авторский кофе, cold brew и лёгкий бранч в тихом пространстве с Wi-Fi — идеально для удалённой работы.",
    descriptionJa:
      "ユンサバードの静かなカフェ。スペシャルティコーヒー、コールドブリュー、軽いブランチとWi-Fi完備。",
    address: "3 Shahrisabz Passage, Yunusabad",
    city: "Tashkent",
    phone: "+998 71 222 77 88",
    openingHours: "Mon–Sun 08:00–21:00",
    latitude: 41.3375,
    longitude: 69.2912,
    mainImageUrl: getRestaurantMainImage("coffee-talk-yunusabad"),
    galleryImageUrls: getRestaurantGallery("coffee-talk-yunusabad"),
    categorySlug: "coffee-shop",
    priceLevel: 2,
    cuisineType: "Coffee",
    isPublished: true,
  },
  {
    slug: "cinnamon-bakery",
    name: "Cinnamon Bakery",
    descriptionUz:
      "Yangi pishirilgan kek, kruasan va medovik. Kofe bilan nonushta yoki kechki choy uchun shirin tanlov.",
    descriptionEn:
      "Freshly baked cakes, croissants, and honey cake medovik — a sweet stop for breakfast pastries or afternoon tea with coffee.",
    descriptionRu:
      "Свежая выпечка, круассаны и медовик — сладкая остановка для завтрака или послеобеденного чая с кофе.",
    descriptionJa:
      "焼きたてのケーキ、クロワッサン、メドヴィーク。朝食やアフタヌーンティーにぴったりのスイーツ店。",
    address: "21 Nukus Street",
    city: "Tashkent",
    phone: "+998 71 233 66 99",
    openingHours: "Mon–Sun 07:30–20:00",
    latitude: 41.3184,
    longitude: 69.2689,
    mainImageUrl: getRestaurantMainImage("cinnamon-bakery"),
    galleryImageUrls: getRestaurantGallery("cinnamon-bakery"),
    categorySlug: "dessert",
    priceLevel: 2,
    cuisineType: "Dessert",
    isPublished: true,
  },
];

export const reviews: ReviewSeed[] = [
  {
    userEmail: "user@example.com",
    restaurantSlug: "plov-markazi-chorsu",
    rating: 5,
    title: "Best plov near Chorsu",
    content:
      "The yellow plov was fragrant and perfectly cooked. Generous meat portions and warm bread straight from the tandoor. A must-visit when exploring the old city.",
    visitDate: "2025-11-12",
    imageUrls: [getReviewImage("review-plov-1"), getReviewImage("review-plov-2")],
  },
  {
    userEmail: "aziza@example.com",
    restaurantSlug: "plov-markazi-chorsu",
    rating: 4,
    title: "Authentic atmosphere",
    content:
      "Busy but authentic. Service is fast even at lunch peak. The qazi side dish was excellent, though seating can be tight on weekends.",
    visitDate: "2025-10-03",
  },
  {
    userEmail: "user@example.com",
    restaurantSlug: "afsona-restaurant",
    rating: 5,
    title: "Perfect family dinner",
    content:
      "Manti and pumpkin samsa were highlights. Staff helped us choose dishes for kids. Clean interior and fair prices for the location.",
    visitDate: "2025-12-01",
    imageUrls: [getReviewImage("review-afsona-1")],
  },
  {
    userEmail: "kenji@example.com",
    restaurantSlug: "yapona-mama",
    rating: 4,
    title: "Solid sushi in Tashkent",
    content:
      "Salmon rolls were fresh and the miso soup tasted homemade. Ramen broth was rich, though slightly salty for my preference.",
    visitDate: "2025-09-18",
    imageUrls: [getReviewImage("review-yapona-1")],
  },
  {
    userEmail: "aziza@example.com",
    restaurantSlug: "yapona-mama",
    rating: 5,
    title: "Lively and delicious",
    content:
      "Great energy on Friday night. Tempura platter was crispy and the green tea service felt thoughtful. Will return with friends.",
    visitDate: "2025-11-25",
  },
  {
    userEmail: "kenji@example.com",
    restaurantSlug: "sakura-sushi-bar",
    rating: 5,
    title: "Premium sushi sets",
    content:
      "Chef's omakase-style set was beautifully presented. Quiet ambiance compared to downtown spots — ideal for a date.",
    visitDate: "2025-10-30",
    imageUrls: [getReviewImage("review-sakura-1"), getReviewImage("review-sakura-2")],
  },
  {
    userEmail: "user@example.com",
    restaurantSlug: "korean-house-tashkent",
    rating: 4,
    title: "Fun BBQ night",
    content:
      "Marinated beef and pork belly were flavorful. Kimchi refills were generous. Ventilation could be better but overall a great group meal.",
    visitDate: "2025-08-22",
  },
  {
    userEmail: "aziza@example.com",
    restaurantSlug: "istanbul-kebab-palace",
    rating: 4,
    title: "Hearty doner wraps",
    content:
      "Large portions and friendly staff. Turkish breakfast plate on Saturday morning was surprisingly complete with olives, cheese, and eggs.",
    visitDate: "2025-11-08",
    imageUrls: [getReviewImage("review-istanbul-1")],
  },
  {
    userEmail: "user@example.com",
    restaurantSlug: "trattoria-amici",
    rating: 5,
    title: "Excellent pasta",
    content:
      "Tagliatelle with mushroom cream sauce was outstanding. Tiramisu felt authentic. Reservations recommended on weekends.",
    visitDate: "2025-12-15",
    imageUrls: [getReviewImage("review-trattoria-1")],
  },
  {
    userEmail: "kenji@example.com",
    restaurantSlug: "bon-european-bistro",
    rating: 4,
    title: "Good steak and salads",
    content:
      "Medium-rare ribeye was cooked well. Caesar salad fresh. Wine list is small but reasonably priced for Tashkent.",
    visitDate: "2025-09-05",
  },
  {
    userEmail: "aziza@example.com",
    restaurantSlug: "evos-fast-food",
    rating: 3,
    title: "Quick and consistent",
    content:
      "Standard fast food experience. Lavash combo is filling and affordable. Good option when you need something fast near the metro.",
    visitDate: "2025-10-12",
  },
  {
    userEmail: "user@example.com",
    restaurantSlug: "lavash-city",
    rating: 4,
    title: "Student favorite",
    content:
      "Huge shawarma for the price. Queue moves quickly at lunchtime. Not fancy, but reliable after classes.",
    visitDate: "2025-11-19",
  },
  {
    userEmail: "kenji@example.com",
    restaurantSlug: "coffee-talk-yunusabad",
    rating: 5,
    title: "Great workspace cafe",
    content:
      "Flat white was balanced and the cold brew smooth. Plenty of outlets and calm music. Spent three hours working here comfortably.",
    visitDate: "2025-12-02",
    imageUrls: [getReviewImage("review-coffee-1")],
  },
  {
    userEmail: "aziza@example.com",
    restaurantSlug: "coffee-talk-yunusabad",
    rating: 4,
    title: "Nice brunch spot",
    content:
      "Avocado toast and cappuccino were well prepared. Pastries sell out early — come before noon on Saturdays.",
    visitDate: "2025-11-03",
  },
  {
    userEmail: "user@example.com",
    restaurantSlug: "cinnamon-bakery",
    rating: 5,
    title: "Medovik heaven",
    content:
      "Honey cake slices are generous and not overly sweet. Croissants flaky and buttery. Perfect with morning coffee.",
    visitDate: "2025-10-28",
    imageUrls: [getReviewImage("review-cinnamon-1")],
  },
  {
    userEmail: "kenji@example.com",
    restaurantSlug: "cinnamon-bakery",
    rating: 4,
    title: "Sweet stop",
    content:
      "Cheesecake and eclairs were fresh. Small seating area fills up quickly but takeaway packaging is neat.",
    visitDate: "2025-09-14",
  },
  {
    userEmail: "aziza@example.com",
    restaurantSlug: "afsona-restaurant",
    rating: 4,
    title: "Elegant national cuisine",
    content:
      "Lagman was rich and the bread basket kept coming. Slightly slow service during a wedding party nearby, but food quality stayed high.",
    visitDate: "2025-08-30",
  },
  {
    userEmail: "user@example.com",
    restaurantSlug: "sakura-sushi-bar",
    rating: 4,
    title: "Fresh fish",
    content:
      "Nigiri selection tasted clean and light. Miso eggplant side was a pleasant surprise. Prices higher than average but justified.",
    visitDate: "2025-11-11",
  },
  {
    userEmail: "aziza@example.com",
    restaurantSlug: "trattoria-amici",
    rating: 5,
    title: "Anniversary dinner",
    content:
      "Staff arranged a small dessert surprise. Pizza crust had a nice char and the burrata appetizer was creamy and fresh.",
    visitDate: "2025-12-20",
    imageUrls: [getReviewImage("review-trattoria-2")],
  },
  {
    userEmail: "kenji@example.com",
    restaurantSlug: "korean-house-tashkent",
    rating: 5,
    title: "Best galbi in town",
    content:
      "Galbi marinated overnight — tender and smoky from the grill. Banchan variety impressed our group of six. Loud but festive.",
    visitDate: "2025-10-07",
    imageUrls: [getReviewImage("review-korean-1")],
  },
];
