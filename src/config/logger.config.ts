
import { validateAndTransformConfig } from '@app/core/config/utils/validate-config.util';
import { registerAs } from '@nestjs/config';
import { IsOptional, IsString } from 'class-validator';

class EnvironmentVariables {
  @IsString()
  @IsOptional()
  LOG_LEVEL: string = 'debug';

  @IsString()
  @IsOptional()
  LOG_PRETTY: string = 'true';
}

export interface LoggerConfig {
  level: string;
  isPretty: boolean;
}

export const loggerConfiguration = registerAs('logger', (): LoggerConfig => {
  const rawConfig = {
    LOG_LEVEL: process.env.LOG_LEVEL ?? 'debug',
    LOG_PRETTY: process.env.LOG_PRETTY ?? 'true',
  };

  const validated = validateAndTransformConfig(
    EnvironmentVariables,
    rawConfig,
    'Logger Config',
  );

  return {
    level: validated.LOG_LEVEL,
    isPretty: validated.LOG_PRETTY === 'true',
  };
});
