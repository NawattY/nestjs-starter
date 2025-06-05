import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshTokenRequestDto {
  @ApiProperty({
    example: 'KdV1rYiLXijW5rHDOlHQylMB8VIaFIArMTvb9Zbr4ZJwjwwkuxx3ZZ1AzyKUu0hP',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
