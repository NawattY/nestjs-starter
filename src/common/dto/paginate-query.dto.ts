import { DEFAULT_PAGINATION } from '#shared/constants/pagination.constant';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { toInteger } from 'lodash';

export class PaginateQueryDto {
  @ApiProperty({
    example: 1,
    required: false,
    default: DEFAULT_PAGINATION.PAGE,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) =>
    toInteger(value) < 1 ? DEFAULT_PAGINATION.PAGE : toInteger(value),
  )
  @IsNumber()
  page: number = DEFAULT_PAGINATION.PAGE;

  @ApiProperty({
    example: 30,
    required: false,
    default: DEFAULT_PAGINATION.LIMIT,
    type: Number,
  })
  @IsOptional()
  @Transform(({ value }) => {
    let page = toInteger(value);
    if (page < 1) {
      page = DEFAULT_PAGINATION.LIMIT;
    } else if (page > DEFAULT_PAGINATION.MAX_LIMIT) {
      page = DEFAULT_PAGINATION.MAX_LIMIT;
    }

    return page;
  })
  @IsNumber()
  perPage: number = DEFAULT_PAGINATION.LIMIT;
}
