import { Expose } from 'class-transformer';

import {
  PaginatedResultLinkInterface,
  PaginatedResultMetaInterface,
} from '../interfaces/paginated-result.interface';

export abstract class PaginateResponseDto<T> {
  abstract items: T[];

  @Expose()
  meta!: PaginatedResultMetaInterface;

  @Expose()
  links?: PaginatedResultLinkInterface;
}
