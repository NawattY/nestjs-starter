import { z } from 'zod';

import {
  envIntegerSchema,
  envStringSchema,
  requiredEnvStringSchema,
} from './utils/validate-config.util';

const coreValidationSchema = z.object({
  NODE_ENV: z.enum(['local', 'develop', 'staging', 'uat', 'production', 'test']).default('local'),
  APP_HOST: envStringSchema('localhost'),
  APP_PORT: envIntegerSchema(3000, 1),
  APP_NAME: requiredEnvStringSchema,
});

export function validateCoreConfig(config: Record<string, unknown>) {
  return coreValidationSchema.parse(config);
}
