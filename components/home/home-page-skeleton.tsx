import {
  CategoryCardSkeleton,
  RestaurantCardSkeleton,
} from "@/components/restaurants/restaurant-card";
import { Skeleton } from "@/components/ui/skeleton";

export function HomePageSkeleton() {
  return (
    <div className="space-y-16 md:space-y-20">
      <section>
        <Skeleton className="h-8 w-56" />
        <Skeleton className="mt-3 h-5 w-96 max-w-full" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <CategoryCardSkeleton key={index} />
          ))}
        </div>
      </section>

      <section>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-3 h-5 w-80 max-w-full" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <RestaurantCardSkeleton key={index} />
          ))}
        </div>
      </section>

      <section>
        <Skeleton className="h-8 w-72" />
        <Skeleton className="mt-3 h-5 w-80 max-w-full" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <RestaurantCardSkeleton key={index} />
          ))}
        </div>
      </section>

      <section>
        <Skeleton className="mx-auto h-8 w-48" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-40 rounded-2xl" />
          ))}
        </div>
      </section>

      <Skeleton className="h-56 rounded-2xl" />
    </div>
  );
}
