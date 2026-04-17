import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { toInteger } from 'lodash';

import { DEFAULT_PAGINATION } from '../../constants/pagination.constant';
import { PaginatedRequestInterface } from '../interfaces/paginated-request.interface';

export class PaginateQueryDto implements PaginatedRequestInterface {
  @IsOptional()
  @Transform(({ value }) =>
    toInteger(toInteger(value)) < 1 ? DEFAULT_PAGINATION.PAGE : toInteger(value),
  )
  @IsNumber()
  page: number = DEFAULT_PAGINATION.PAGE;

  @IsOptional()
  @Transform(({ value }) => {
    let perPage = toInteger(value);
    if (perPage < 1) {
      perPage = DEFAULT_PAGINATION.LIMIT;
    } else if (perPage > DEFAULT_PAGINATION.MAX_LIMIT) {
      perPage = DEFAULT_PAGINATION.MAX_LIMIT;
    }

    return perPage;
  })
  @IsNumber()
  perPage: number = DEFAULT_PAGINATION.LIMIT;
}
