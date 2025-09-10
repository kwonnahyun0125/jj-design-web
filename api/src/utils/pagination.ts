export type PageParams = { page?: number; pageSize?: number; maxPageSize?: number };

export function normalizePageParams({ page = 1, pageSize = 20, maxPageSize = 100 }: PageParams) {
  const p = Number.isFinite(page) && page! > 0 ? page! : 1;
  const s = Math.min(Math.max(1, pageSize!), maxPageSize!);
  return { skip: (p - 1) * s, take: s, page: p, pageSize: s };
}
