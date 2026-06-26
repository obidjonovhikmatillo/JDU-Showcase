import { MessageCircle, Star } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { formatRating } from "@/components/projects/star-rating";
import type { ProjectDetailRecord } from "@/lib/data/comment-types";

type ProjectRatingShowcaseProps = {
  project: ProjectDetailRecord;
};

export async function ProjectRatingShowcase({
  project,
}: ProjectRatingShowcaseProps) {
  const t = await getTranslations("ProjectDetail.ratingShowcase");

  if (project.commentCount === 0 || project.averageRating === null) {
    return null;
  }

  const displayRating = formatRating(project.averageRating);

  return (
    <section className="flex items-center gap-6 rounded-lg bg-muted/30 px-6 py-5">
      {/* Rating */}
      <div className="flex items-center gap-2">
        <Star
          className="size-5 fill-foreground text-foreground"
          aria-hidden
        />
        <span className="text-2xl font-bold tracking-tight text-foreground">
          {displayRating}
        </span>
      </div>

      <div className="h-8 w-px bg-border" aria-hidden />

      {/* Comment count */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MessageCircle className="size-4" aria-hidden />
        <span>
          {t("basedOnComments", { count: project.commentCount })}
        </span>
      </div>
    </section>
  );
}
