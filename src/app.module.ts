import { AppController } from '#app.controller';
import { AppService } from '#app.service';
import { ConfigModule } from '#config/config.module';
import { DatabaseModule } from '#database/database.module';
import { LoggerModule } from '#libs/logger/logger.module';
import { AuthModule } from '#modules/auth/auth.module';
import { UserModule } from '#modules/user/user.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [ConfigModule, DatabaseModule, LoggerModule, UserModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
