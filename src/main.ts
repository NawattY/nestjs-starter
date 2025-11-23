import { NestFactory } from '@nestjs/core';
import { Logger, VersioningType } from '@nestjs/common';
import { AppModule } from '#app.module';
import { CoreConfigService } from '#core/config/config.service';
import { createValidationPipe } from '#core/pipes';
import helmet from 'helmet';
import * as compression from 'compression';
import { setupSwagger } from '#api/swagger.setup';
import { LoggerService } from '#core/logger/services/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(LoggerService));

  const coreConfigService = app.get(CoreConfigService);
  const port = coreConfigService.getPort();
  const host = coreConfigService.getHost();

  // 🌐 Set global prefix (optional)
  app.setGlobalPrefix('api');

  // ✅ Enable shutdown hooks (for db/scheduler/etc.)
  app.enableShutdownHooks();

  // 🛡️ Optional: Enable Cors
  app.enableCors({
  // กำหนด Type อย่างชัดเจน: origin เป็น string | undefined, callback เป็น CorsCallback
  origin: async (
    origin: string | undefined, // Origin ของ Request (อาจเป็น undefined ถ้าไม่มี header)
    callback: (err: Error | null, allow?: boolean) => void // Type ของ Callback
  ) => { 
    // 1. ถ้า Origin ไม่ถูกส่งมา (เช่น Request มาจาก Server) ให้ผ่านไป
    if (!origin) {
      return callback(null, true);
    }
    
    const FIXED_ALLOWED = ['http://localhost:3000', 'https://api.yourdomain.com'];
    if (FIXED_ALLOWED.includes(origin)) {
      return true;
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, 
});

  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.use(helmet());
  app.use(compression());

  // ✅ เปิด ValidationPipe แบบ global
  app.useGlobalPipes(createValidationPipe({ transformOptions: { enableImplicitConversion: true }}));

  setupSwagger(app);

  // ✅ Start App
  await app.listen(port, host);
  const logger = new Logger('NestApplication');
  logger.log(`🚀 App started on http://${host}:${port}/api`);
}
bootstrap();
