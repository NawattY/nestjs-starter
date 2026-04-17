import { CoreAuthModule } from '@app/core/auth/core-auth.module';
import { CacheModule } from '@app/core/cache/cache.module';
import { CoreConfigModule } from '@app/core/config/config.module';
import { CoreDatabaseModule } from '@app/core/database/database.module';
import { PrismaService } from '@app/core/database/prisma.service';
import { CoreEventModule } from '@app/core/event/core-event.module';
import { HttpExceptionFilter } from '@app/core/exceptions/http-exception.filter';
import { GlobalSerializerInterceptor } from '@app/core/interceptors/global-serializer.interceptor';
import { HttpLoggerInterceptor } from '@app/core/logger/interceptors/http-logger.interceptor';
import { LoggerModule } from '@app/core/logger/logger.module';
import { AuthModule } from '@app/modules/auth/auth.module';
import { UserModule } from '@app/modules/user/user.module';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { ClsModule } from 'nestjs-cls';

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
