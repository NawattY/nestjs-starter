import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  mobile: string;

  @Expose()
  fullName: string;

  @Expose()
  isActive: boolean;
}
