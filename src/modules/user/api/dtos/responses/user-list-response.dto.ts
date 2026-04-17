import { PaginateResponseDto } from '@app/shared/dto/paginate-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

import { UserResponseDto } from './user-response.dto';

export class UserListResponseDto extends PaginateResponseDto<UserResponseDto> {
  @ApiProperty({ type: [UserResponseDto] })
  @Expose()
  @Type(() => UserResponseDto)
  readonly items!: UserResponseDto[];
}
