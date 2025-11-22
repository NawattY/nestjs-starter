import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({ description: 'User ID' })
  @Expose()
  id!: string;

  @ApiProperty({ description: 'Mobile number' })
  @Expose()
  mobile!: string;

  @ApiProperty({ description: 'Email address', required: false })
  @Expose()
  email?: string;

  @ApiProperty({ description: 'First name', required: false })
  @Expose()
  firstName?: string;

  @ApiProperty({ description: 'Last name', required: false })
  @Expose()
  lastName?: string;

  @ApiProperty({ description: 'User status' })
  @Expose()
  status!: string;

  @ApiProperty({ description: 'Created at' })
  @Expose()
  createdAt!: Date;

  @ApiProperty({ description: 'Updated at' })
  @Expose()
  updatedAt!: Date;
}


