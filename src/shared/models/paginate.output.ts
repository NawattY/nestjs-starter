import { Expose, Type } from 'class-transformer';

export class PaginationMeta {
  @Expose()
  totalItems!: number;

  @Expose()
  itemCount!: number;

  @Expose()
  itemsPerPage!: number;

  @Expose()
  totalPages!: number;

  @Expose()
  currentPage!: number;
}

export class PaginationLinks {
  @Expose()
  first?: string;

  @Expose()
  previous?: string;

  @Expose()
  next?: string;

  @Expose()
  last?: string;
}

export abstract class PaginatedOutput<T> {
  abstract items: T[];

  @Expose()
  @Type(() => PaginationMeta)
  meta!: PaginationMeta;

  @Expose()
  @Type(() => PaginationLinks)
  links?: PaginationLinks;
}
