import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserRequestDto {
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly lastName?: string;
}
