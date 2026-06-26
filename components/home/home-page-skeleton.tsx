import { ProjectCardSkeleton } from "@/components/projects/project-card";
import { Skeleton } from "@/components/ui/skeleton";

function HeroSkeleton() {
  return (
    <div className="pb-8 pt-10 sm:pb-12 sm:pt-16 lg:pb-14 lg:pt-20">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-4 h-12 w-full max-w-xl sm:h-14" />
        <Skeleton className="mt-3 h-12 w-full max-w-md sm:h-14" />
        <Skeleton className="mt-5 h-5 w-full max-w-lg" />
        <Skeleton className="mt-2 h-5 w-80 max-w-full" />
        <Skeleton className="mt-8 h-13 w-full max-w-2xl rounded-full sm:mt-10 sm:h-14" />
      </div>
      <div className="mt-8 flex items-center justify-center gap-2.5 sm:mt-10">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-28 shrink-0 rounded-full" />
        ))}
      </div>
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <div>
      <HeroSkeleton />

      <div className="space-y-14 md:space-y-16">
        <section>
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-5 w-28" />
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProjectCardSkeleton key={index} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-5 w-28" />
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProjectCardSkeleton key={index} />
            ))}
          </div>
        </section>

        <Skeleton className="h-56 rounded-2xl" />
      </div>
    </div>
  );
}
