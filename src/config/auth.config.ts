import { registerAs } from '@nestjs/config';
import type { StringValue as MsStringValue } from 'ms';
import { z } from 'zod';

import {
  envMsDurationSchema,
  requiredEnvStringSchema,
  validateAndTransformConfig,
} from '../core/config/utils/validate-config.util';

const authConfigSchema = z.object({
  JWT_ACCESS_SECRET: requiredEnvStringSchema,
  JWT_ACCESS_EXPIRES_IN: envMsDurationSchema('3600s'),
  JWT_REFRESH_SECRET: requiredEnvStringSchema,
  JWT_REFRESH_EXPIRES_IN: envMsDurationSchema('30d'),
});

type AuthEnvironmentVariables = z.infer<typeof authConfigSchema>;

function readAuthEnvironmentVariables(): Record<keyof AuthEnvironmentVariables, unknown> {
  return {
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
  };
}

export interface AuthConfig {
  jwtAccessSecret: string;
  jwtAccessExpiresIn: MsStringValue;
  jwtRefreshSecret: string;
  jwtRefreshExpiresIn: MsStringValue;
}

export const authConfiguration = registerAs('auth', (): AuthConfig => {
  const validatedEnv = validateAndTransformConfig(
    authConfigSchema,
    readAuthEnvironmentVariables(),
    'Auth Config',
  );

  return {
    jwtAccessSecret: validatedEnv.JWT_ACCESS_SECRET,
    jwtAccessExpiresIn: validatedEnv.JWT_ACCESS_EXPIRES_IN,
    jwtRefreshSecret: validatedEnv.JWT_REFRESH_SECRET,
    jwtRefreshExpiresIn: validatedEnv.JWT_REFRESH_EXPIRES_IN,
  };
});
