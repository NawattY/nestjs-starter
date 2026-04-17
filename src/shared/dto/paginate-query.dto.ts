import { DEFAULT_PAGINATION } from '@app/constants/pagination.constant';
import { PaginatedRequestInterface } from '@app/shared/interfaces/paginated-request.interface';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { toInteger } from 'lodash';

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
