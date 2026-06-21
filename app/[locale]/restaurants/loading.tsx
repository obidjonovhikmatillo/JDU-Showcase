import { RestaurantCardSkeleton } from "@/components/restaurants/restaurant-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function RestaurantsLoading() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96 max-w-full" />
      </div>
      <Skeleton className="h-11 w-full max-w-3xl" />
      <div className="hidden gap-4 rounded-2xl border border-border/60 bg-muted/20 p-4 lg:grid lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-16 rounded-lg" />
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <RestaurantCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
