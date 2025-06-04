import { validateAndTransformConfig } from '#core/config/utils/validate-config.util';
import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

class EnvironmentVariables {
  @IsNotEmpty()
  @IsString()
  JWT_SECRET: string;

  @IsString()
  @IsOptional()
  JWT_EXPIRES_IN: string = '3600s';

  @IsNotEmpty()
  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsString()
  @IsOptional()
  JWT_REFRESH_EXPIRES_IN: string = '30d';
}

// Export Interface เพื่อ Type Hint
export interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  jwtRefreshSecret: string;
  jwtRefreshExpiresIn: string;
}

// Configuration Factory
export const authConfiguration = registerAs('auth', (): AuthConfig => {
  // 1. รวบรวมค่า Config ดิบจาก process.env
  const rawConfig = {
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN,
  };

  // 2. เรียกใช้ Utility Function กลางในการ Validate และ Transform
  const validatedEnv = validateAndTransformConfig(
    EnvironmentVariables, // Class ที่ใช้ Validate
    rawConfig, // ข้อมูลดิบ
    'Auth Config', // Namespace สำหรับ Error Message
  );

  // 3. Return ค่าที่ผ่านการ Validate และอาจจะมีการปรับแต่งเพิ่มเติม
  return {
    jwtSecret: validatedEnv.JWT_SECRET,
    jwtExpiresIn: validatedEnv.JWT_EXPIRES_IN,
    jwtRefreshSecret: validatedEnv.JWT_REFRESH_SECRET,
    jwtRefreshExpiresIn: validatedEnv.JWT_REFRESH_EXPIRES_IN,
  };
});
