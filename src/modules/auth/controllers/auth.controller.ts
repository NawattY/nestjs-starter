import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AuthService } from '../services/auth.service';
import { LoginRequestDto } from '../dtos/requests/login-request.dto';
import { RefreshTokenRequestDto } from '../dtos/requests/refresh-token-request.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '#shared/decorators/current-user.decorator';
import { UserEntity } from '#modules/user/entities/user.entity';
import { UserResponseDto } from '../dtos/responses/user-response.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { loginResponse } from '../swagger/login.response';
import { AuthResponseDto } from '../dtos/responses/auth-response.dto';
import { refreshResponse } from '../swagger/refresh-token.response';
import { ApiResponses } from '#shared/decorators/api-response.decorator';
import { revokeRefreshResponse } from '../swagger/refresh-token-revoke.response';
import { meResponse } from '../swagger/me.response';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Auth login',
    description: 'Login to the system',
  })
  @ApiResponses(loginResponse)
  @Post('login')
  async login(@Body() loginDto: LoginRequestDto): Promise<AuthResponseDto> {
    const result = await this.authService.login(loginDto);
    return plainToInstance(AuthResponseDto, result);
  }

  @ApiOperation({
    summary: 'Auth login by refresh token',
    description: 'Get new access token by refresh token',
  })
  @ApiResponses(refreshResponse)
  @Post('refresh')
  async refresh(
    @Body() refreshTokenDto: RefreshTokenRequestDto,
  ): Promise<AuthResponseDto> {
    const result = await this.authService.refresh(refreshTokenDto.refreshToken);
    return plainToInstance(AuthResponseDto, result);
  }

  @ApiOperation({
    summary: 'Revoke refresh token',
    description: 'Revocation refresh token',
  })
  @ApiBearerAuth()
  @ApiResponses(revokeRefreshResponse)
  @UseGuards(JwtAuthGuard)
  @Post('revoke')
  async revoke(
    @Body() refreshTokenDto: RefreshTokenRequestDto,
    @CurrentUser() user: UserEntity,
  ): Promise<void> {
    await this.authService.revoke(user.id, refreshTokenDto.refreshToken);
  }

  @ApiBearerAuth()
  @ApiResponses(meResponse)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: UserEntity) {
    return plainToInstance(UserResponseDto, user);
  }
}
