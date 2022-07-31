import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { projectConstants } from '@do-business/constants';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: projectConstants.AuthConstants.refreshSecret,
    });
  }

  async validate({ refreshId, accessId }) {
    const user = Object.assign(await this.authService.getRefreshPayload(refreshId), { refreshId, accessId });

    return user;
  }
}
