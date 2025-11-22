import { validateAndTransformConfig } from '#core/config/utils/validate-config.util';
import { registerAs } from '@nestjs/config';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

class EnvironmentVariables {
  @IsString()
  @IsOptional()
  REDIS_HOST: string = 'localhost';

  @IsNumber()
  @IsOptional()
  REDIS_PORT: number = 6379;

  @IsString()
  @IsOptional()
  REDIS_PASSWORD?: string;

  @IsNumber()
  @IsOptional()
  REDIS_DB: number = 0;

  @IsBoolean()
  @IsOptional()
  REDIS_ENABLED: boolean = true;
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  enabled: boolean;
}

export const redisConfiguration = registerAs('redis', (): RedisConfig => {
  const validated = validateAndTransformConfig(
    EnvironmentVariables,
    process.env,
    'Redis Config',
  );

  return {
    host: validated.REDIS_HOST,
    port: validated.REDIS_PORT,
    password: validated.REDIS_PASSWORD,
    db: validated.REDIS_DB,
    enabled: validated.REDIS_ENABLED,
  };
});
