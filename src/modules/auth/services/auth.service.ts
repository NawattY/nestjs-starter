import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/modules/user/services/user.service';
import { LoginDto } from '../dtos/login.dto';
import { AuthResponseDto } from '../dtos/auth-response.dto';
import { UserAuthException } from '../exceptions/user-auth.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(params: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userService.findByUsername(params.username);
    if (!user) {
      throw UserAuthException.userNotFound();
    }

    const isPasswordValid = await bcrypt.compare(
      params.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw UserAuthException.credentialMismatch();
    }

    const token = this.jwtService.sign({ sub: user.id });
    return {
      accessToken: token,
      userId: user.id,
    };
  }
}
