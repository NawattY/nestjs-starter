import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from '#app.module';
import { HttpExceptionFilter } from '#shared/filters/http-exception.filter';
import { GlobalSerializerInterceptor } from '#shared/interceptors/global-serializer.interceptor';
import { setupSwagger } from '#shared/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') ?? 3000;
  const host = configService.get<string>('app.host') ?? 'localhost';

  // 🌐 Set global prefix (optional)
  app.setGlobalPrefix('api');

  // ✅ Enable shutdown hooks (for db/scheduler/etc.)
  app.enableShutdownHooks();

  // 🛡️ Optional: Enable Cors
  app.enableCors();

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new GlobalSerializerInterceptor(app.get(Reflector)),
  );

  // ✅ เปิด ValidationPipe แบบ global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ตัด field ที่ไม่อยู่ใน DTO
      forbidNonWhitelisted: true, // ถ้ามี field เกินมา → throw error
      transform: true, // แปลง primitive (เช่น string → number) ตาม type ของ DTO
    }),
  );

  setupSwagger(app);

  // ✅ Start App
  await app.listen(port, host);
  const logger = new Logger('NestApplication');
  logger.log(`🚀 App started on http://${host}:${port}/api`);
}
bootstrap();
