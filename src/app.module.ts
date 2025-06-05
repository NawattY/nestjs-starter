import { AppController } from '#app.controller';
import { AppService } from '#app.service';
import { CoreConfigModule } from '#core/config/config.module';
import { DatabaseModule } from '#core/database/database.module';
import { LoggerModule } from '#core/logger/logger.module';
import { AuthModule } from '#modules/auth/auth.module';
import { UserModule } from '#modules/user/user.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    CoreConfigModule,
    DatabaseModule,
    LoggerModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
