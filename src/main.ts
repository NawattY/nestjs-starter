import { NestFactory, Reflector } from '@nestjs/core';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from '#app.module';
import { HttpExceptionFilter } from '#shared/filters/http-exception.filter';
import { GlobalSerializerInterceptor } from '#shared/interceptors/global-serializer.interceptor';
import { setupSwagger } from '#config/swagger.config';
import { CoreConfigService } from '#core/config/config.service';
import { ValidationError } from 'class-validator';
import { ERROR_CODE } from '#shared/constants/error-code.constant';

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
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const errors = validationErrors.reduce((accumulator, currentValue) => {
          accumulator[currentValue.property] = Object.values(
            currentValue.constraints ?? {},
          );
          return accumulator;
        }, {});

        // สร้าง Exception object ในรูปแบบที่ HttpExceptionFilter รู้จัก
        return new BadRequestException({
          errorCode: ERROR_CODE.VALIDATE_ERROR,
          errorMessage: 'VALIDATE_ERROR',
          errors: errors,
        });
      },
    }),
  );

  setupSwagger(app);

  // ✅ Start App
  await app.listen(port, host);
  const logger = new Logger('NestApplication');
  logger.log(`🚀 App started on http://${host}:${port}/api`);
}
bootstrap();
