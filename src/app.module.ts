import { ApiModule } from '#api/api.module';

import { CoreConfigModule } from '#core/config/config.module';
import { CoreDatabaseModule } from '#core/database/database.module';
import { LoggerModule } from '#core/logger/logger.module';
import { GlobalSerializerInterceptor } from '#core/interceptors/global-serializer.interceptor';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from '#core/exceptions/http-exception.filter';
import { CoreAuthModule } from '#core/auth/core-auth.module';
import { HttpLoggerInterceptor } from '#core/logger/interceptors/http-logger.interceptor';
import { CacheModule } from '#core/cache/cache.module';
import { CoreEventModule } from '#core/event/core-event.module';

@Module({
  imports: [
    CoreConfigModule,
    CoreDatabaseModule,
    CacheModule,
    CoreAuthModule,
    CoreEventModule,
    LoggerModule,
    ApiModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalSerializerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },

  ],
})
export class AppModule {}
