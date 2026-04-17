import { Expose } from 'class-transformer';

export class AuthResponseDto {
  @Expose()
  readonly accessToken!: string;

  @Expose()
  readonly refreshToken!: string;
}
