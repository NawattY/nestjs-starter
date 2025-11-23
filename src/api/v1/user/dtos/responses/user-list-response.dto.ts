import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginateResponseDto } from '#shared/dto/paginate-response.dto';
import { UserResponseDto } from './user-response.dto';

export class UserListResponseDto extends PaginateResponseDto<UserResponseDto> {
  @ApiProperty({ type: [UserResponseDto] })
  @Expose()
  @Type(() => UserResponseDto)
  items!: UserResponseDto[];
}
