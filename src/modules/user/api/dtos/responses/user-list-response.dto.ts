import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { PaginateResponseDto } from '@app/shared/dto/paginate-response.dto';

import { UserResponseDto } from './user-response.dto';

export class UserListResponseDto extends PaginateResponseDto<UserResponseDto> {
  @ApiProperty({ type: [UserResponseDto] })
  @Expose()
  @Type(() => UserResponseDto)
  readonly items!: UserResponseDto[];
}