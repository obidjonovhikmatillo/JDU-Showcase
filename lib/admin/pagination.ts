export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

export type PaginationInput = {
  page?: number;
  pageSize?: number;
};

export type PaginationResult = {
  page: number;
  pageSize: number;
  skip: number;
  totalPages: (total: number) => number;
};

export function parsePagination(input: PaginationInput = {}): PaginationResult {
  const page = Math.max(1, Number(input.page) || 1);
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(5, Number(input.pageSize) || DEFAULT_PAGE_SIZE),
  );

  return {
    page,
    pageSize,
    skip: (page - 1) * pageSize,
    totalPages: (total: number) => Math.max(1, Math.ceil(total / pageSize)),
  };
}

export function parseSearchParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value[0]?.trim() || undefined;
  }

  const trimmed = value?.trim();
  return trimmed || undefined;
}

export function parseOptionalInt(
  value: string | string[] | undefined,
): number | undefined {
  const raw = parseSearchParam(value);
  if (!raw) {
    return undefined;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}
