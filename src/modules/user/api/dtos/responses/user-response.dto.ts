import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({ description: 'User ID' })
  @Expose()
  readonly id!: string;

  @ApiProperty({ description: 'Mobile number' })
  @Expose()
  readonly mobile!: string;

  @ApiProperty({ description: 'Email address', required: false })
  @Expose()
  readonly email?: string;

  @ApiProperty({ description: 'First name', required: false })
  @Expose()
  readonly firstName?: string;

  @ApiProperty({ description: 'Last name', required: false })
  @Expose()
  readonly lastName?: string;

  @ApiProperty({ description: 'User status' })
  @Expose()
  readonly status!: string;

  @ApiProperty({ description: 'Created at' })
  @Expose()
  readonly createdAt!: Date;

  @ApiProperty({ description: 'Updated at' })
  @Expose()
  readonly updatedAt!: Date;
}