"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";

import type { RestaurantImageRecord } from "@/lib/data/review-types";
import { cn } from "@/lib/utils";

type RestaurantGalleryCarouselProps = {
  mainImageUrl: string | null;
  images: RestaurantImageRecord[];
  restaurantName: string;
};

export function RestaurantGalleryCarousel({
  mainImageUrl,
  images,
  restaurantName,
}: RestaurantGalleryCarouselProps) {
  const t = useTranslations("RestaurantDetail");
  const slides = useMemo(() => {
    const urls: string[] = [];

    if (mainImageUrl) {
      urls.push(mainImageUrl);
    }

    for (const image of images) {
      if (!urls.includes(image.imageUrl)) {
        urls.push(image.imageUrl);
      }
    }

    return urls;
  }, [mainImageUrl, images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const total = slides.length;
  const hasMultiple = total > 1;

  const goTo = useCallback(
    (index: number) => {
      if (total === 0) {
        return;
      }

      setActiveIndex((index + total) % total);
    },
    [total],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  if (total === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="group relative h-[min(56vw,420px)] min-h-56 overflow-hidden rounded-xl">
        <Image
          key={slides[activeIndex]}
          src={slides[activeIndex]}
          alt={t("galleryImageAlt", {
            name: restaurantName,
            index: activeIndex + 1,
            total,
          })}
          fill
          priority={activeIndex === 0}
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, 80vw"
        />

        {hasMultiple ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute top-1/2 left-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/95 text-foreground transition hover:bg-background md:left-4 md:size-10 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
              aria-label={t("galleryPrevious")}
            >
              <ChevronLeftIcon className="size-5 shrink-0" aria-hidden />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute top-1/2 right-3 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/95 text-foreground transition hover:bg-background md:right-4 md:size-10 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
              aria-label={t("galleryNext")}
            >
              <ChevronRightIcon className="size-5 shrink-0" aria-hidden />
            </button>

            <div className="absolute inset-x-0 bottom-0 flex justify-center bg-linear-to-t from-black/35 to-transparent px-4 pb-4 pt-10">
              <div
                className="flex items-center gap-1.5"
                role="tablist"
                aria-label={t("galleryDotsLabel")}
              >
                {slides.map((url, index) => (
                  <button
                    key={url}
                    type="button"
                    role="tab"
                    aria-selected={index === activeIndex}
                    aria-label={t("galleryDotLabel", {
                      index: index + 1,
                      total,
                    })}
                    onClick={() => goTo(index)}
                    className={cn(
                      "size-2.5 rounded-full transition",
                      index === activeIndex
                        ? "bg-white scale-110"
                        : "bg-white/50 hover:bg-white/75",
                    )}
                  />
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
