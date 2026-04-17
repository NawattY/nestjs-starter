import { AuthUser } from '@app/core/auth/auth-user.decorator';
import { JwtAuthGuard } from '@app/core/auth/jwt-auth.guard';
import { JwtPayload } from '@app/core/auth/jwt-payload.interface';
import { AuthService } from '@app/modules/auth/application/auth.service';
import { LoginInput } from '@app/modules/auth/application/models/inputs/login.input';
import { RefreshTokenInput } from '@app/modules/auth/application/models/inputs/refresh-token.input';
import { ROUTES } from '@app/routes/app-routes.constant';
import { ApiResponses } from '@app/shared/decorators/api-response.decorator';
import { Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';

import { LoginRequestDto } from '../dtos/requests/login-request.dto';
import { RefreshRequestDto } from '../dtos/requests/refresh-request.dto';
import { AuthResponseDto } from '../dtos/responses/auth-response.dto';
import { MeResponseDto } from '../dtos/responses/me-response.dto';
import { loginResponse } from '../swagger/login.response';
import { logoutResponse } from '../swagger/logout.response';
import { meResponse } from '../swagger/me.response';
import { refreshResponse } from '../swagger/refresh-token.response';

@Controller(ROUTES.V1.AUTH.ROOT)
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @ApiOperation({
    summary: 'Password login',
    description: 'Login with password',
  })
  @ApiResponses(loginResponse)
  @Post(ROUTES.V1.AUTH.LOGIN)
  async login(@Body() dto: LoginRequestDto, @Req() req: Request): Promise<AuthResponseDto> {
    const input = new LoginInput({
      mobile: dto.username,
      password: dto.password,
      userAgent: req.headers['user-agent'] || '',
      ip: req.ip || '',
    });
    const auth = await this.auth.loginWithPassword(input);

    return plainToInstance(AuthResponseDto, auth);
  }

  @ApiOperation({
    summary: 'Auth login by refresh token',
    description: 'Get new access token by refresh token',
  })
  @ApiResponses(refreshResponse)
  @Post(ROUTES.V1.AUTH.REFRESH)
  async refresh(@Body() dto: RefreshRequestDto, @Req() req: Request): Promise<AuthResponseDto> {
    const input = new RefreshTokenInput({
      refreshToken: dto.refreshToken,
      userAgent: req.headers['user-agent'] || '',
      ip: req.ip || '',
    });

    return this.auth.refresh(input);
  }

  @ApiOperation({
    summary: 'Auth logout',
    description: 'Logout',
  })
  @ApiBearerAuth()
  @ApiResponses(logoutResponse)
  @UseGuards(JwtAuthGuard)
  @Post(ROUTES.V1.AUTH.LOGOUT)
  @HttpCode(204)
  async logout(@AuthUser() user: JwtPayload): Promise<void> {
    return this.auth.logout(user.sid);
  }

  @ApiOperation({
    summary: 'Get current user',
    description: 'Get current user',
  })
  @ApiBearerAuth()
  @ApiResponses(meResponse)
  @UseGuards(JwtAuthGuard)
  @Get(ROUTES.V1.AUTH.ME)
  async me(@AuthUser() user: JwtPayload): Promise<MeResponseDto> {
    const userInfo = await this.auth.getUserById(user.uid);
    return plainToInstance(MeResponseDto, userInfo);
  }
}
