/**
 * ================================================================
 * RepositoryTypes
 * ================================================================
 *
 * Shared repository contracts used across the CRM.
 *
 * Goals
 * -----
 * âœ“ Strong typing
 * âœ“ ORM independent
 * âœ“ Future Prisma/Supabase compatibility
 * âœ“ Generic CRUD interfaces
 * âœ“ Enterprise repository standards
 */

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

export interface SortOptions {
  field: string;
  direction?: "asc" | "desc";
}

export interface ListOptions<TFilter = Record<string, unknown>> {
  filter?: TFilter;
  pagination?: PaginationOptions;
  sort?: SortOptions;
}

export interface PagedResult<TEntity> {
  items: TEntity[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface IRepository<
  TEntity,
  TCreate,
  TUpdate
> {
  getById(id: string): Promise<TEntity | null>;

  getAll(
    options?: ListOptions
  ): Promise<PagedResult<TEntity>>;

  create(
    input: TCreate
  ): Promise<TEntity>;

  update(
    id: string,
    input: TUpdate
  ): Promise<TEntity>;

  delete(
    id: string
  ): Promise<void>;
}





