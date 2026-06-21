import type { RestaurantSummary } from "@/lib/data/restaurant-types";

import type { DiscoveryFilters } from "./discovery-params";

export type DiscoveryResult = {
  items: RestaurantSummary[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  filters: DiscoveryFilters;
};
