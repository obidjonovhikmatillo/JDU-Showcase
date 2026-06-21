import Image from "next/image";

import type { RestaurantImageRecord } from "@/lib/data/review-types";

type AirbnbGalleryGridProps = {
  mainImageUrl: string | null;
  images: RestaurantImageRecord[];
  restaurantName: string;
};

export function AirbnbGalleryGrid({
  mainImageUrl,
  images,
  restaurantName,
}: AirbnbGalleryGridProps) {
  const galleryUrls = images.map((image) => image.imageUrl);
  const hero = mainImageUrl ?? galleryUrls[0];
  const secondary = galleryUrls.filter((url) => url !== hero).slice(0, 4);

  if (!hero) {
    return null;
  }

  return (
    <div className="grid h-[min(56vw,420px)] grid-cols-1 gap-2 overflow-hidden rounded-xl md:grid-cols-[1.2fr_1fr] md:grid-rows-2">
      <div className="relative row-span-2 min-h-56 overflow-hidden rounded-xl md:min-h-0">
        <Image
          src={hero}
          alt={restaurantName}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
        />
      </div>
      <div className="hidden grid-cols-2 grid-rows-2 gap-2 md:grid">
        {secondary.map((url, index) => (
          <div key={`${url}-${index}`} className="relative min-h-0 overflow-hidden rounded-xl">
            <Image
              src={url}
              alt={restaurantName}
              fill
              className="object-cover"
              sizes="20vw"
            />
          </div>
        ))}
        {secondary.length < 4
          ? Array.from({ length: 4 - secondary.length }).map((_, index) => (
              <div
                key={`placeholder-${index}`}
                className="rounded-xl bg-muted"
                aria-hidden
              />
            ))
          : null}
      </div>
    </div>
  );
}
