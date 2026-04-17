import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { AppModule } from '@app/app.module';
import { CoreConfigService } from '@app/core/config/config.service';
import { API_GLOBAL_PREFIX, configureApp } from '@app/core/config/utils/configure-app.util';
import { LoggerService } from '@app/core/logger/services/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(LoggerService));

  const coreConfigService = app.get(CoreConfigService);
  const port = coreConfigService.getPort();
  const host = coreConfigService.getHost();

  configureApp(app);

  await app.listen(port, host);
  const logger = new Logger('NestApplication');
  logger.log(`🚀 App started on http://${host}:${port}/${API_GLOBAL_PREFIX}`);
}

void bootstrap();
