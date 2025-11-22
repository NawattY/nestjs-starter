import { Module } from '@nestjs/common';
import { AuthModule } from '#modules/auth/auth.module';
import { UserModule } from '#modules/user/user.module';
import { AuthController } from './auth/controllers/auth.controller';
import { UserController } from './user/controllers/user.controller';

@Module({
  imports: [
    AuthModule,
    UserModule,
  ],
  controllers: [
    AuthController,
    UserController,
  ],
})
export class ApiV1Module {}
