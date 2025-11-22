import { Expose } from 'class-transformer';

export class MeResponseDto {
  @Expose()
  id!: string;

  @Expose()
  email?: string;

  @Expose()
  fullName!: string;

  @Expose()
  isActive!: boolean;
}
