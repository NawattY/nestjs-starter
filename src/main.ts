import { NestFactory, Reflector } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '#app.module';
import { HttpExceptionFilter } from '#shared/filters/http-exception.filter';
import { GlobalSerializerInterceptor } from '#shared/interceptors/global-serializer.interceptor';
import { setupSwagger } from '#config/swagger.config';
import { CoreConfigService } from '#core/config/config.service';
import { createValidationPipe } from '#shared/pipes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const coreConfigService = app.get(CoreConfigService);
  const port = coreConfigService.getPort();
  const host = coreConfigService.getHost();

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
  app.useGlobalPipes(createValidationPipe());

  setupSwagger(app);

  // ✅ Start App
  await app.listen(port, host);
  const logger = new Logger('NestApplication');
  logger.log(`🚀 App started on http://${host}:${port}/api`);
}
bootstrap();
