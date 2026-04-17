import {
  PaginatedResultLinkInterface,
  PaginatedResultMetaInterface,
} from '@app/shared/interfaces/paginated-result.interface';
import { Expose } from 'class-transformer';

export abstract class PaginateResponseDto<T> {
  abstract items: T[];

  @Expose()
  meta!: PaginatedResultMetaInterface;

  @Expose()
  links?: PaginatedResultLinkInterface;
}
