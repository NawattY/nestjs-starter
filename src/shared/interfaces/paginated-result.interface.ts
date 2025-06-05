export interface PaginatedResultInterface<T> {
  items: T[];
  meta: PaginatedResultMetaInterface;
  links?: PaginatedResultLinkInterface;
}

export interface PaginatedResultMetaInterface {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedResultLinkInterface {
  first?: string;
  previous?: string;
  next?: string;
  last?: string;
}
