/** Project images from public/images/restaurants (Dribbble UI shots) */

const base = "/images/restaurants";

export const photos = {
  spendwise: `${base}/0b2e21945fa87aea7e3da7bdb32ae296.jpg`,
  oraWellness: `${base}/dac5da54bda87f5b8ba339af9291b2db.jpg`,
  ideaHub: `${base}/8c31c8714a197980e776b4214b28454d.jpg`,
  healthTrack: `${base}/85ce67268859fc02413baf915b440693.jpg`,
  abcBank: `${base}/2d041f35a8f3a00f14c804f935f90652.jpg`,
  urbanGreen: `${base}/5fa085cddad7a22fb3bc546bd85f181c.jpg`,
  everbloom: `${base}/8778917be30052eb5965f37ec47796a1.jpg`,
  taxFile3D: `${base}/c280d9d6dea8d615b5b3d48a3e98e062.jpg`,
  payWallet: `${base}/dc6a77823886a0f357321b3887e80904.jpg`,
  profileCard: `${base}/5caa2727ef92ff8e65d6e598424640c9.jpg`,
  fashionCards: `${base}/6156963ecb8d4e20cea55378a9340025.jpg`,
  panoraStress: `${base}/9993e89069eb595cead0c40d72b425cf.jpg`,
  sleepQuality: `${base}/0bed2ca8ae605aea19db475cd9cbff98.jpg`,
  mobileApps: `${base}/b46a342416a4cb77cdf8e318dfe90753.jpg`,
  gradientIcons: `${base}/1ce859c14b9d6e67efa5dac9b35b127d.jpg`,
  niceAtNoon: `${base}/c5ac19f2b3a6f00a4bc4cefec5170b0f.jpg`,
  focusWork: `${base}/a8761aad80616282d3cd53eca3351ca6.jpg`,
  briteBrand: `${base}/e80daaba9c5c134cc29f72657685c29c.jpg`,
  missoApp: `${base}/fdfb6192da53de17b2c58e7d7993a5ff.jpg`,
  // New images
  growthAnalytics: `${base}/39e3c8d5547442fe59e6053b3c08d000.jpg`,
  bookingSummary: `${base}/0b0a4b899f09a0f0b72ea773cc5a8db4.jpg`,
  yandexFuel: `${base}/777e6994a80c86e49f1aa42f69a4f37f.jpg`,
  qicInsurance: `${base}/5866fadb06a621fd373d611bb71bdf03.jpg`,
  purposeIcons: `${base}/af089e92f4bd448f845c1b9408456b7c.jpg`,
  evernote: `${base}/a2e65c09b59d176c1dc8b3b45f21d5d5.jpg`,
} as const;

export const projectImages: Record<string, { main: string; gallery: string[] }> = {
  "spendwise-finance": {
    main: photos.spendwise,
    gallery: [photos.spendwise, photos.purposeIcons, photos.payWallet],
  },
  "ora-wellness": {
    main: photos.oraWellness,
    gallery: [photos.oraWellness, photos.bookingSummary, photos.evernote],
  },
  "ideahub-platform": {
    main: photos.ideaHub,
    gallery: [photos.ideaHub, photos.growthAnalytics, photos.focusWork],
  },
  "healthtrack-monitor": {
    main: photos.healthTrack,
    gallery: [photos.healthTrack, photos.panoraStress, photos.sleepQuality],
  },
  "abcbank-digital": {
    main: photos.abcBank,
    gallery: [photos.abcBank, photos.taxFile3D, photos.growthAnalytics],
  },
  "urbangreen-tech": {
    main: photos.urbanGreen,
    gallery: [photos.urbanGreen, photos.everbloom, photos.evernote],
  },
  "niceatnoon-studio": {
    main: photos.niceAtNoon,
    gallery: [photos.niceAtNoon, photos.qicInsurance, photos.fashionCards],
  },
  "panora-wellness": {
    main: photos.panoraStress,
    gallery: [photos.panoraStress, photos.mobileApps, photos.bookingSummary],
  },
  "fashion-ecommerce": {
    main: photos.fashionCards,
    gallery: [photos.fashionCards, photos.yandexFuel, photos.profileCard],
  },
  "misso-collab": {
    main: photos.missoApp,
    gallery: [photos.missoApp, photos.purposeIcons, photos.growthAnalytics],
  },
  "brite-payments": {
    main: photos.briteBrand,
    gallery: [photos.briteBrand, photos.qicInsurance, photos.evernote],
  },
  "gradient-icon-pack": {
    main: photos.gradientIcons,
    gallery: [photos.gradientIcons, photos.purposeIcons, photos.focusWork],
  },
};

export const commentImages: Record<string, string> = {};

export function getProjectMainImage(slug: string): string {
  return projectImages[slug]?.main ?? photos.spendwise;
}

export function getProjectGallery(slug: string): string[] {
  return projectImages[slug]?.gallery ?? [photos.spendwise];
}

export function getCommentImage(key: string): string {
  return commentImages[key] ?? photos.ideaHub;
}

export const FALLBACK_PROJECT_IMAGE = photos.spendwise;
export const FALLBACK_HERO_IMAGE = photos.niceAtNoon;
