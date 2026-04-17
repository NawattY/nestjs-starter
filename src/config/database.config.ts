import { readEnvironmentValue } from '@app/core/config/utils/read-environment.util';
import {
  requiredEnvStringSchema,
  validateAndTransformConfig,
} from '@app/core/config/utils/validate-config.util';
import { registerAs } from '@nestjs/config';
import { z } from 'zod';

const databaseConfigSchema = z.object({
  DATABASE_URL: requiredEnvStringSchema,
});

export interface PrismaDatabaseConfig {
  url: string;
}

export const databaseConfiguration = registerAs('database', (): PrismaDatabaseConfig => {
  const validated = validateAndTransformConfig(
    databaseConfigSchema,
    {
      DATABASE_URL: readEnvironmentValue('DATABASE_URL'),
    },
    'Database Config',
  );

  return {
    url: validated.DATABASE_URL,
  };
});
