import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { appConfigurations } from '../../config';
import { CoreConfigService } from './config.service';
import { validateCoreConfig } from './validation';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      // เรียงลำดับความสำคัญของไฟล์ .env จากซ้ายไปขวา (ไฟล์แรกที่เจอ key จะถูกใช้)
      envFilePath: [
        '.env.local',
        `.env.${process.env.NODE_ENV}.local`, // e.g., .env.development.local
        `.env.${process.env.NODE_ENV}`, // e.g., .env.development
        '.env', // ไฟล์ .env หลัก
      ],
      validate: validateCoreConfig,
      load: appConfigurations,
      cache: true, // (Optional) เปิดใช้งาน caching สำหรับ config ที่โหลดแล้ว
    }),
  ],
  providers: [CoreConfigService],
  exports: [CoreConfigService],
})
export class CoreConfigModule {}
