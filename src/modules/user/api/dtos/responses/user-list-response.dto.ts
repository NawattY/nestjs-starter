import { PaginateResponseDto } from '@app/shared/dto/paginate-response.dto';
import { Expose, Type } from 'class-transformer';

import { UserResponseDto } from './user-response.dto';

export class UserListResponseDto extends PaginateResponseDto<UserResponseDto> {
  @Expose()
  @Type(() => UserResponseDto)
  readonly items!: UserResponseDto[];
}
