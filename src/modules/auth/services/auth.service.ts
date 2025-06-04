import { UserService } from '#modules/user/services/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { LoginRequestDto } from '../dtos/requests/login-request.dto';
import { UserAuthException } from '../exceptions/user-auth.exception';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly refreshTokenRepo: RefreshTokenRepository,
  ) {}

  async login(dto: LoginRequestDto) {
    const user = await this.userService.findByUsername(dto.username);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      UserAuthException.credentialMismatch();
    }

    const payload = { sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = uuidv4();
    await this.refreshTokenRepo.createToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      userId: user.id,
    };
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const token = await this.refreshTokenRepo.findByToken(refreshToken);
    if (!token || token.revokedAt) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userService.findById(token.userId);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const accessToken = this.jwtService.sign({ sub: user.id });

    return { accessToken };
  }

  async revoke(userId: string, refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const token = await this.refreshTokenRepo.findByToken(refreshToken);
    if (!token || token.revokedAt || token.userId !== userId) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    await this.refreshTokenRepo.revokeToken(refreshToken);
    return { success: true };
  }
}
