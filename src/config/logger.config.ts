
import { validateAndTransformConfig } from '#core/config/utils/validate-config.util';
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
  const validated = validateAndTransformConfig(
    EnvironmentVariables,
    process.env,
    'Logger Config',
  );

  return {
    level: validated.LOG_LEVEL,
    isPretty: validated.LOG_PRETTY === 'true',
  };
});
