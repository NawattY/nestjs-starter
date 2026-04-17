import { Expose } from 'class-transformer';

export class MeResponseDto {
  @Expose()
  readonly id!: string;

  @Expose()
  readonly email?: string;

  @Expose()
  readonly fullName!: string;

  @Expose()
  readonly isActive!: boolean;
}