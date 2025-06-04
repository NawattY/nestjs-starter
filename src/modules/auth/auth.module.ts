import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '#modules/user/user.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { authConfiguration } from '#config/auth.config';
import { ConfigType } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([RefreshTokenEntity]),
    JwtModule.registerAsync({
      useFactory: (authConfig: ConfigType<typeof authConfiguration>) => {
        return {
          secret: authConfig.jwtSecret,
          signOptions: {
            expiresIn: authConfig.jwtExpiresIn,
          },
        };
      },
      inject: [authConfiguration.KEY], // 3. **สำคัญมาก:** ต้อง inject authConfiguration.KEY ที่นี่
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RefreshTokenRepository],
  // exports: [AuthService, JwtAuthGuard], // (Optional) ถ้า Module อื่นต้องการใช้ AuthService หรือ Guard
})
export class AuthModule {}
