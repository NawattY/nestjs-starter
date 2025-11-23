import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '#modules/auth/services/auth.service';
import { JwtAuthGuard } from '#core/auth/jwt-auth.guard';
import { AuthUser } from '#core/auth/auth-user.decorator';
import { JwtPayload } from '#modules/auth/rbac/jwt-payload.interface';
import { AuthResponseDto } from '../dtos/responses/auth-response.dto';
import { MeResponseDto } from '../dtos/responses/me-response.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiResponses } from '#shared/decorators/api-response.decorator';
import { loginResponse, meResponse, refreshResponse } from '../swagger';
import { plainToInstance } from 'class-transformer';
import { LoginRequestDto } from '../dtos/requests/login-request.dto';
import { RefreshRequestDto } from '../dtos/requests/refresh-request.dto';
import { logoutResponse } from '../swagger/logout.response';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // -------------------------------------------------------------
  // PASSWORD LOGIN
  // -------------------------------------------------------------
  @ApiOperation({
    summary: 'Password login',
    description: 'Login with password',
  })
  @ApiResponses(loginResponse)
  @Post('login')
  async login(@Body() dto: LoginRequestDto, @Req() req: Request): Promise<AuthResponseDto> {
    const auth = await this.auth.loginWithPassword({
      mobile: dto.username,
      password: dto.password,
      userAgent: req.headers['user-agent'] || '',
      ip: req.ip || '',
    });

    return plainToInstance(AuthResponseDto, auth);
  }

  // -------------------------------------------------------------
  // REFRESH TOKEN (ROTATE)
  // -------------------------------------------------------------
  @ApiOperation({
    summary: 'Auth login by refresh token',
    description: 'Get new access token by refresh token',
  })
  @ApiResponses(refreshResponse)
  @Post('refresh')
  async refresh(@Body() dto: RefreshRequestDto, @Req() req: Request): Promise<AuthResponseDto> {
    return this.auth.refresh({
      refreshToken: dto.refreshToken,
      userAgent: req.headers['user-agent'] || '',
      ip: req.ip || '',
    });
  }

  // -------------------------------------------------------------
  // LOGOUT (REVOKE SESSION)
  // -------------------------------------------------------------
  @ApiOperation({
    summary: 'Auth logout',
    description: 'Logout',
  })
  @ApiBearerAuth()
  @ApiResponses(logoutResponse)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(204)
  async logout(@AuthUser() user: JwtPayload): Promise<void> {
    return this.auth.logout(user.sid);
  }

  // -------------------------------------------------------------
  // GET CURRENT USER
  // -------------------------------------------------------------
  @ApiOperation({
    summary: 'Get current user',
    description: 'Get current user',
  })
  @ApiBearerAuth()
  @ApiResponses(meResponse)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@AuthUser() user: JwtPayload): Promise<MeResponseDto> {
    const userInfo = await this.auth.getUserById(user.uid);
    return plainToInstance(MeResponseDto, userInfo);
  }
}
