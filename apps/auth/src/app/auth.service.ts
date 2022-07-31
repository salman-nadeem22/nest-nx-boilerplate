import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import {RedisCacheService ,rpc} from '@do-business/common';
import { JwtService } from '@nestjs/jwt';

import { projectConstants, serviceEvents} from '@do-business/constants';
import { v4 as uuid } from 'uuid';
import { ClientRMQ } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);
  private FetchUserData;

  constructor(@Inject(projectConstants.ServicesClient.USER) private userClient: ClientRMQ, private readonly jwtService: JwtService, private readonly redisCacheService: RedisCacheService) {
    this.FetchUserData = rpc.FetchData(this.userClient);
  }

  async login(payload: { user: any; ipAddress: string; userAgent: any }) {
    const { user, ipAddress, userAgent } = payload;

    if (!user.isMatched) throw new UnauthorizedException('Invalid Credentials');

    return { _id: user.user._id, ipAddress, ua: userAgent.ua };
  }

  // ? Tokens methods
  async refreshToken(payload: { id: string; ipAddress?: string; ua?: string; accessToken: string }) {
    const refreshId: string = this.REFRESH_Mapper(payload);
    const refreshToken = this.jwtService.sign(
      { refreshId, accessId: payload.accessToken },
      {
        secret: projectConstants.AuthConstants.refreshSecret,
        expiresIn: projectConstants.AuthConstants.refreshExpireAt,
      }
    );
    await this.redisCacheService.setTTL(refreshId, { id: payload.id, ipAddress: payload.ipAddress, ua: payload.ua }, projectConstants.AuthConstants.refreshExpireAt);
    return { refreshToken };
  }

  async sendTokens(data: { id: string; ipAddress: string; ua: string }) {
    const dataForTokens = { id: data.id, ipAddress: data.ipAddress, ua: data.ua };
    const { accessToken } = await this.accessToken(dataForTokens);

    const { refreshToken } = await this.refreshToken({ ...dataForTokens, accessToken });
    return { state: 'LOGIN', access: accessToken, refresh: refreshToken };
  }

  async createResetToken(data: { id: string; ipAddress: string; ua: string }) {
    const dataForTokens = { id: data.id, ipAddress: data.ipAddress, ua: data.ua };
    const { resetToken } = await this.resetToken(dataForTokens);
    return { reset: resetToken };
  }

  async resetToken(payload: { id: string; ipAddress?: string; ua?: string }) {
    return {
      resetToken: this.jwtService.sign(
        { id: payload.id, uId: uuid() },
        {
          secret: projectConstants.AuthConstants.resetSecret,
          expiresIn: projectConstants.AuthConstants.resetExpireAt,
        }
      ),
    };
  }

  async accessToken(payload: { id: string; ipAddress?: string; ua?: string }) {
    return {
      accessToken: this.jwtService.sign(
        { id: payload.id, uId: uuid() },
        {
          secret: projectConstants.AuthConstants.jwtSecret,
          expiresIn: projectConstants.AuthConstants.jwtExpireAt,
        }
      ),
    };
  }

  async verifyRefreshToken(payload) {
    return await this.redisCacheService.get(payload);
  }

  async getUser(userId: string, throwErr = false) {
    const data = rpc.FetchObject(this.userClient);
    return data({cmd:serviceEvents.User.FIND_USER_BY_ID}, { userId, throwErr });
  }

  async removeRefreshToken(payload: { refreshId: string }) {
    return await this.redisCacheService.del(payload.refreshId);
  }

  // ? Private methods
  private UserIdMapper(user: { id: string }, uId: string, mapFor: string) {
    return `${user.id}:${mapFor}:${uId}`;
  }

  private REFRESH_Mapper(user: { id: string }, uId = uuid()) {
    return this.UserIdMapper(user, uId, 'REFRESH');
  }
}
