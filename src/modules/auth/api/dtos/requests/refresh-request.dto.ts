import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshRequestDto {
  @ApiProperty({
    example: 'KdV1rYiLXijW5rHDOlHQylMB8VIaFIArMTvb9Zbr4ZJwjwwkuxx3ZZ1AzyKUu0hP',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  readonly refreshToken!: string;
}