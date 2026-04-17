import { registerAs } from '@nestjs/config';
import { z } from 'zod';

import {
  envBooleanSchema,
  envStringSchema,
  validateAndTransformConfig,
} from '../core/config/utils/validate-config.util';

const loggerConfigSchema = z.object({
  LOG_LEVEL: envStringSchema('debug'),
  LOG_PRETTY: envBooleanSchema.default(true),
});

export interface LoggerConfig {
  level: string;
  isPretty: boolean;
}

export const loggerConfiguration = registerAs('logger', (): LoggerConfig => {
  const validated = validateAndTransformConfig(
    loggerConfigSchema,
    {
      LOG_LEVEL: process.env.LOG_LEVEL ?? 'debug',
      LOG_PRETTY: process.env.LOG_PRETTY,
    },
    'Logger Config',
  );

  return {
    level: validated.LOG_LEVEL,
    isPretty: validated.LOG_PRETTY,
  };
});
