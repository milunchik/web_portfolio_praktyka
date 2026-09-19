import { PAGINATION } from '../constants';

export type Pagination = { page: number; limit: number; offset: number };

export const buildPagination = (page?: number, limit?: number): Pagination => {
  const p = Math.max(1, Number(page ?? PAGINATION.DEFAULT_PAGE));
  const l = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, Number(limit ?? PAGINATION.DEFAULT_LIMIT)),
  );
  return { page: p, limit: l, offset: (p - 1) * l };
};
