import {
  envBooleanSchema,
  optionalEnvStringSchema,
  validateAndTransformConfig,
} from '@app/core/config/utils/validate-config.util';
import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const databaseConfigSchema = z.object({
  DATABASE_URL: optionalEnvStringSchema,
  DATABASE_CONNECT_ON_BOOT: envBooleanSchema.default(false),
});

export interface PrismaDatabaseConfig {
  url?: string;
  connectOnBoot: boolean;
}

export const databaseConfiguration = registerAs('database', (): PrismaDatabaseConfig => {
  const validated = validateAndTransformConfig(
    databaseConfigSchema,
    {
      DATABASE_URL: process.env.DATABASE_URL,
      DATABASE_CONNECT_ON_BOOT: process.env.DATABASE_CONNECT_ON_BOOT,
    },
    'Database Config',
  );

  return {
    url: validated.DATABASE_URL,
    connectOnBoot: validated.DATABASE_CONNECT_ON_BOOT,
  };
});
