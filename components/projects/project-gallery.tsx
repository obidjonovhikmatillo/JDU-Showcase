import Image from "next/image";
import { getTranslations } from "next-intl/server";

import type { ProjectImageRecord } from "@/lib/data/comment-types";

type ProjectGalleryProps = {
  images: ProjectImageRecord[];
  projectTitle: string;
};

export async function ProjectGallery({
  images,
  projectTitle,
}: ProjectGalleryProps) {
  const t = await getTranslations("ProjectDetail");

  if (images.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">{t("galleryTitle")}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border/60"
          >
            <Image
              src={image.imageUrl}
              alt={projectTitle}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
