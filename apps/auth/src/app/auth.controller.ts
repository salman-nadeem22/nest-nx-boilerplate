import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { serviceEvents } from '@do-business/constants';
import { Controller, Logger, UnauthorizedException, UseFilters, UseInterceptors, UsePipes } from '@nestjs/common';

import { filters, interceptors, pipes } from '@do-business/services';
import { JwtService } from '@nestjs/jwt';

@UseInterceptors(interceptors.ServiceTransformInterceptor)
@UseFilters(filters.UnprocessableEntityExceptionFilter)
@UseFilters(filters.ServiceHTTPExceptionFilter)
@UsePipes(pipes.ValidationPipe)
@Controller()
export class AuthController {
  private logger = new Logger(AuthController.name);
  constructor(private readonly authService: AuthService, private readonly jwtService: JwtService) {}

  // ? Role based Login
  @MessagePattern(serviceEvents.Auth.LOGIN)
  async login(@Payload() payload) {
    const { userAgent, ipAddress } = payload;

    const response = await this.authService.login(payload);
    const dataForTokens = { id: response._id, ipAddress, ua: userAgent.ua };
    // ? Sending tokens to client
    return this.authService.sendTokens(dataForTokens);
  }

  @MessagePattern(serviceEvents.Auth.CREATE_TOKENS)
  async createTokens(@Payload() payload) {
    return await this.authService.sendTokens(payload);
  }

  @MessagePattern(serviceEvents.Auth.VERIFY_REFRESH_TOKEN)
  async verifyRefreshToken(@Payload() refreshToken: string) {
    const user = await this.authService.verifyRefreshToken(refreshToken);
    if (!user) throw new UnauthorizedException();
    return user;
  }

  @MessagePattern(serviceEvents.Auth.VERIFY_ACCESS_TOKEN)
  async verifyAccessToken(@Payload() data: { id: string; uId: string }) {
    return await this.authService.getUser(data.id, false);
  }

  @MessagePattern(serviceEvents.Auth.REFRESH_TOKEN)
  async refreshAccessToken(@Payload() data: { id: string; ipAddress: string; ua: string }) {
    const { ua, ipAddress, id } = data;
    const dataForTokens = { id, ipAddress, ua };

    // * Sending tokens to client
    return this.authService.sendTokens(dataForTokens);
  }

  @MessagePattern(serviceEvents.Auth.REMOVE_REFRESH_TOKEN)
  async removeRefresh(data: { refreshId: string }) {
    return this.authService.removeRefreshToken(data);
  }
}
