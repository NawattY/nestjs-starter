import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { GlobalSerializerInterceptor } from './shared/interceptors/serializer.interceptor';

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

  // ✅ Start App
  await app.listen(port, host);
  const logger = new Logger('NestApplication');
  logger.log(`🚀 App started on http://${host}:${port}/api`);
}
bootstrap();
