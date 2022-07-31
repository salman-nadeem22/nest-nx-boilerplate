import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBasicAuth, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IpAddress } from '../../common/IpAddress.decorator';
import { AgentDetail, UserAgent } from '../../common/userAgent.decorator';
import { User } from '../../common/user.decorator';
import { BasicAuthGuard, RefreshAuthGuard } from './auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'To login as vendor, client or admin',
    externalDocs: {
      url: 'https://togo-wireframe.invisionapp.com/prototype/super-admin-ckruhl0o1001pxo010ugnhe29/play/6a23c68a',
      description: 'Wire Frame Example',
    },
  })
  @ApiResponse({ status: 200, description: 'Return access and refresh tokens' })
  @ApiBasicAuth()
  @UseGuards(BasicAuthGuard)
  @ApiParam({ name: 'role', required: true, description: 'User Type', schema: { type: 'string' }, enum: ['vendor', 'client', 'admin'] })
  @Get('login')
  async login(@User() user, @IpAddress() ipAddress, @UserAgent() userAgent: AgentDetail, @Param('role') role: string) {
    return this.authService.login({ user, ipAddress, userAgent, role });
  }

  @ApiOperation({ summary: 'To get new authentication tokens' })
  @ApiResponse({ status: 200, description: 'Return new access and refresh tokens' })
  @ApiBearerAuth()
  @UseGuards(RefreshAuthGuard)
  @Get('refresh-token')
  async RefreshToken(@User() user, @IpAddress() ipAddress, @UserAgent() userAgent: AgentDetail) {
    await this.authService.removeRefreshId(user);
    return await this.authService.refresh({ id: user.id, ipAddress, ua: userAgent.ua });
  }
}
