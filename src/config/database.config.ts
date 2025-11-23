import { validateAndTransformConfig } from '#core/config/utils/validate-config.util';
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
  const validated = validateAndTransformConfig(
    EnvironmentVariables,
    process.env,
    'Database Config',
  );

  return {
    url: validated.DATABASE_URL,
  };
});
