import { DEFAULT_PAGINATION } from '#shared/constants/pagination.constant';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumberString, IsOptional } from 'class-validator';
import { toInteger } from 'lodash';

export class PaginateQueryDto {
  @ApiProperty({
    example: 1,
    required: false,
    default: DEFAULT_PAGINATION.PAGE,
  })
  @IsOptional()
  @Transform(({ value }) => toInteger(value))
  @IsNumberString()
  page?: number = DEFAULT_PAGINATION.PAGE;

  @ApiProperty({
    example: 30,
    required: false,
    default: DEFAULT_PAGINATION.LIMIT,
  })
  @IsOptional()
  @Transform(({ value }) => toInteger(value))
  @IsNumberString()
  perPage?: number = DEFAULT_PAGINATION.LIMIT;
}
