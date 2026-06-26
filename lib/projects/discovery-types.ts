import type { ProjectSummary } from "@/lib/data/project-types";

import type { DiscoveryFilters } from "./discovery-params";

export type DiscoveryResult = {
  items: ProjectSummary[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  filters: DiscoveryFilters;
};
