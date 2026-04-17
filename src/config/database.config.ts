import { validateAndTransformConfig } from '@app/core/config/utils/validate-config.util';
import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsString } from 'class-validator';

class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;
}

export interface PrismaDatabaseConfig {
  url: string;
}

export const databaseConfiguration = registerAs('database', (): PrismaDatabaseConfig => {
  const rawConfig = {
    DATABASE_URL: process.env.DATABASE_URL,
  };

  const validated = validateAndTransformConfig(
    EnvironmentVariables,
    rawConfig,
    'Database Config',
  );

  return {
    url: validated.DATABASE_URL,
  };
});
