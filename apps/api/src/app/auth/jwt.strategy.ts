import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { projectConstants } from '@do-business/constants';
import { AuthService } from './auth.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: projectConstants.AuthConstants.jwtSecret,
    });
  }

  async validate(payload) {
    const user = await this.authService.IsAccessVerified(payload);
    return user || false;
  }
}
