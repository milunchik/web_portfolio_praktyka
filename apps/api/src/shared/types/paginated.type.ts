export type Paginated<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export type PaginationParams = {
  page: number;
  limit: number;
  offset: number;
};

export type RawPaginationQuery = {
  page?: unknown;
  limit?: unknown;
};
