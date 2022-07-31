import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { projectConstants } from '@do-business/constants';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class ResetStrategy extends PassportStrategy(Strategy, 'reset') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: projectConstants.AuthConstants.resetSecret,
    });
  }

  async validate(payload) {
    const user = await this.authService.IsAccessVerified(payload);
    return user;
  }
}
