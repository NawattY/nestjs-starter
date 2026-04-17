import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly mobile!: string;

  @Expose()
  readonly email?: string;

  @Expose()
  readonly firstName?: string;

  @Expose()
  readonly lastName?: string;

  @Expose()
  readonly status!: string;

  @Expose()
  readonly createdAt!: Date;

  @Expose()
  readonly updatedAt!: Date;
}
