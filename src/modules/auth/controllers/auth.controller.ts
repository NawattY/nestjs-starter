import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { AuthResponseDto } from '../dtos/auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }
}
