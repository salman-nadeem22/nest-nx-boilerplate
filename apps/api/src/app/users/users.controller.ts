import { Body, Controller, Get, Logger, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AgentDetail, UserAgent } from '../../common/userAgent.decorator';
import { IpAddress } from '../../common/IpAddress.decorator';
import { JwtAuthGuard } from '../auth/auth.guard';
import { User } from '../../common/user.decorator';

@ApiTags('User')
@Controller('user')
export class UsersController {
  private logger = new Logger(UsersController.name);
  constructor(private readonly userService: UsersService) {}

  @ApiOperation({ summary: 'To register account as client.' })
  @Post('register')
  async register(@Body() createUserDto, @IpAddress() ipAddress, @UserAgent() userAgent: AgentDetail) {
    return this.userService.register({ user: createUserDto, ipAddress, userAgent });
  }

  @ApiOperation({ summary: 'To update user.' })
  @ApiBearerAuth()
  @Patch('update-user')
  @UseGuards(JwtAuthGuard)
  async updateUser(@Body() data, @User() user) {
    return this.userService.updateUser({ body: data, user });
  }

  @ApiOperation({ summary: 'To get logged in user details' })
  @ApiBearerAuth()
  @Get('get-me')
  @UseGuards(JwtAuthGuard)
  async getMe(@User() user) {
    return user;
  }
}
