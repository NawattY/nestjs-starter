import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginateQueryDto } from '#shared/dto/paginate-query.dto';
import { Transform } from 'class-transformer';

export class UserQueryDto extends PaginateQueryDto {
  @ApiProperty({
    example: 'example@example.com',
    required: false,
  })
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: '0999999999',
    required: false,
  })
  @IsOptional()
  mobile?: string;

  @ApiProperty({
    example: 'john',
    required: false,
  })
  @IsOptional()
  fullName?: string;

  @ApiProperty({
    example: false,
    required: false,
    default: false,
  })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
