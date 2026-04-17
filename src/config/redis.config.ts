import { registerAs } from '@nestjs/config';
import { z } from 'zod';

import {
  envBooleanSchema,
  envIntegerSchema,
  envStringSchema,
  optionalEnvStringSchema,
  validateAndTransformConfig,
} from '../core/config/utils/validate-config.util';

const redisConfigSchema = z.object({
  REDIS_HOST: envStringSchema('localhost'),
  REDIS_PORT: envIntegerSchema(6379),
  REDIS_PASSWORD: optionalEnvStringSchema,
  REDIS_DB: envIntegerSchema(0),
  REDIS_ENABLED: envBooleanSchema.default(true),
});

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  enabled: boolean;
}

export const redisConfiguration = registerAs('redis', (): RedisConfig => {
  const validated = validateAndTransformConfig(
    redisConfigSchema,
    {
      REDIS_HOST: process.env.REDIS_HOST,
      REDIS_PORT: process.env.REDIS_PORT,
      REDIS_PASSWORD: process.env.REDIS_PASSWORD,
      REDIS_DB: process.env.REDIS_DB,
      REDIS_ENABLED: process.env.REDIS_ENABLED,
    },
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
