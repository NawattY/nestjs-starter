import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '#modules/user/services/user.service';
import { TokenPayloadInterface } from '../interfaces/token-payload.interface';
import { AuthConfig, authConfiguration } from '#config/auth.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(authConfiguration.KEY)
    private readonly authConfig: AuthConfig,
    private readonly userService: UserService,
  ) {
    const jwtSecret = authConfig.jwtSecret;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in configuration');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: TokenPayloadInterface) {
    return this.userService.findById(payload.sub);
  }
}
