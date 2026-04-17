import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    example: '0990090099',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly username!: string;

  @ApiProperty({
    example: '123456',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly password!: string;
}
