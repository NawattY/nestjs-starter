import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from './user-response.dto';
import { PaginateResponseDto } from '#shared/dto/paginate-response.dto';

export class UserListResponseDto extends PaginateResponseDto<UserResponseDto> {
  @Expose()
  @Type(() => UserResponseDto)
  items: UserResponseDto[];
}
