import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  @IsNotEmpty()
  readonly username!: string;

  @IsString()
  @IsNotEmpty()
  readonly password!: string;
}
