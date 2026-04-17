import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import * as dotenv from 'dotenv';

function getConfiguredEnvFilePaths(): string[] {
  return [
    resolve(process.cwd(), '.env.local'),
    resolve(process.cwd(), `.env.${process.env.NODE_ENV}.local`),
    resolve(process.cwd(), `.env.${process.env.NODE_ENV}`),
    resolve(process.cwd(), '.env'),
  ];
}

export function readEnvironmentVariables(): NodeJS.ProcessEnv {
  let fileConfig: Record<string, string> = {};

  for (const envFilePath of getConfiguredEnvFilePaths()) {
    if (!existsSync(envFilePath)) {
      continue;
    }

    fileConfig = {
      ...dotenv.parse(readFileSync(envFilePath)),
      ...fileConfig,
    };
  }

  return {
    ...fileConfig,
    ...process.env,
  };
}

export function readEnvironmentValue(key: string): string | undefined {
  return readEnvironmentVariables()[key];
}
