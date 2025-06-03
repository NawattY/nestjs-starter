import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/services/user.service';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { LoginRequestDto } from '../dtos/requests/login-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(dto: LoginRequestDto) {
    const user = await this.userService.findByUsername(dto.username);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = uuidv4(); // Replace with actual save logic

    return {
      accessToken,
      refreshToken,
      userId: user.id,
    };
  }

  refresh(refreshToken: string) {
    // TODO: lookup token, validate expiry
    if (!refreshToken) throw new UnauthorizedException('Invalid refresh token');

    // For now, just generate new access token
    const userId = 'example-user-id'; // Replace with DB lookup
    const accessToken = this.jwtService.sign({ sub: userId });

    return { accessToken };
  }
}
