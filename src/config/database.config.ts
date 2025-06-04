import { validateAndTransformConfig } from '#core/config/utils/validate-config.util';
import { registerAs } from '@nestjs/config';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

class EnvironmentVariables {
  @IsString()
  @IsOptional()
  DB_HOST: string = 'localhost';

  @IsInt()
  @IsOptional()
  DB_PORT: number = 5432;

  @IsString()
  @IsNotEmpty()
  DB_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  DB_PASSWORD: string;

  @IsString()
  @IsOptional()
  DB_DATABASE: string = 'postgres';

  @IsBoolean()
  @IsOptional()
  DB_DEBUG: boolean = false;

  @IsBoolean()
  @IsOptional()
  DB_ENABLE_QUERY_LOG: boolean = false;
}

// Export Interface เพื่อ Type Hint
export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  debug: boolean;
  enableQueryLog: boolean;
}

// Configuration Factory
export const databaseConfiguration = registerAs(
  'database',
  (): DatabaseConfig => {
    // 1. รวบรวมค่า Config ดิบจาก process.env
    const rawConfig = {
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_USERNAME: process.env.DB_USERNAME,
      DB_PASSWORD: process.env.DB_PASSWORD,
      DB_DATABASE: process.env.DB_DATABASE,
      DB_DEBUG: process.env.DB_DEBUG,
      DB_ENABLE_QUERY_LOG: process.env.DB_ENABLE_QUERY_LOG,
    };

    console.log(rawConfig);

    // 2. เรียกใช้ Utility Function กลางในการ Validate และ Transform
    const validatedEnv = validateAndTransformConfig(
      EnvironmentVariables, // Class ที่ใช้ Validate
      rawConfig, // ข้อมูลดิบ
      'Auth Config', // Namespace สำหรับ Error Message
    );

    // 3. Return ค่าที่ผ่านการ Validate และอาจจะมีการปรับแต่งเพิ่มเติม
    return {
      host: validatedEnv.DB_HOST,
      port: validatedEnv.DB_PORT,
      username: validatedEnv.DB_USERNAME,
      password: validatedEnv.DB_PASSWORD,
      database: validatedEnv.DB_DATABASE,
      debug: validatedEnv.DB_DEBUG,
      enableQueryLog: validatedEnv.DB_ENABLE_QUERY_LOG,
    };
  },
);
