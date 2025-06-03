import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AuthService } from '../services/auth.service';
import { LoginRequestDto } from '../dtos/requests/login-request.dto';
import { RefreshTokenRequestDto } from '../dtos/requests/refresh-token-request.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '#shared/decorators/current-user.decorator';
import { UserEntity } from '#modules/user/entities/user.entity';
import { UserResponseDto } from '../dtos/responses/user-response.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { loginResponse } from '../swagger/login.response';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Auth login',
    description: 'Login to the system',
  })
  @ApiResponse(loginResponse)
  @Post('login')
  login(@Body() loginDto: LoginRequestDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  refresh(@Body() refreshTokenDto: RefreshTokenRequestDto) {
    return this.authService.refresh(refreshTokenDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: UserEntity) {
    console.log('Current User:', user);
    return plainToInstance(UserResponseDto, user);
  }
}
