import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { ClsModule } from 'nestjs-cls';

import { CoreAuthModule } from './core/auth/core-auth.module';
import { CacheModule } from './core/cache/cache.module';
import { CoreConfigModule } from './core/config/config.module';
import { CoreDatabaseModule } from './core/database/database.module';
import { PrismaService } from './core/database/prisma.service';
import { CoreEventModule } from './core/event/core-event.module';
import { HttpExceptionFilter } from './core/exceptions/http-exception.filter';
import { GlobalSerializerInterceptor } from './core/interceptors/global-serializer.interceptor';
import { HttpLoggerInterceptor } from './core/logger/interceptors/http-logger.interceptor';
import { LoggerModule } from './core/logger/logger.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

const CORE_MODULES = [
  CoreConfigModule,
  CoreDatabaseModule,
  ClsModule.forRoot({
    plugins: [
      new ClsPluginTransactional({
        imports: [CoreDatabaseModule],
        adapter: new TransactionalAdapterPrisma({
          prismaInjectionToken: PrismaService,
          sqlFlavor: 'postgresql',
        }),
      }),
    ],
  }),
  CacheModule,
  CoreAuthModule,
  CoreEventModule,
  LoggerModule,
];

const FEATURE_MODULES = [AuthModule, UserModule];

const GLOBAL_PROVIDERS = [
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
];

@Module({
  imports: [...CORE_MODULES, ...FEATURE_MODULES],
  controllers: [],
  providers: GLOBAL_PROVIDERS,
})
export class AppModule {}
