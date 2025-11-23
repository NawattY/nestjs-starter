import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { CoreConfigService } from './config.service';
import coreValidationSchema from './validation'; // Schema สำหรับ validate core ENV vars
import appConfigs from '../../config'; // โหลด Array ของ registerAs functions จาก src/config/index.ts

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
      validationSchema: coreValidationSchema, // Validate core ENV vars ที่ boilerplate คาดหวัง
      load: appConfigs, // โหลดและ register project-specific typed configurations
      cache: true, // (Optional) เปิดใช้งาน caching สำหรับ config ที่โหลดแล้ว
    }),
  ],
  providers: [CoreConfigService],
  exports: [CoreConfigService],
})
export class CoreConfigModule {}
