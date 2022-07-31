import { BasicStrategy as Strategy } from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { projectConstants } from '@do-business/constants';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy, 'basic') {
  constructor(private readonly userService: UsersService) {
    super({ passReqToCallback: true });
  }

  public validate = async (req, username: string, password: string): Promise<boolean> => {
    const role = req.params.role;

    if (![projectConstants.Role.CLIENT, projectConstants.Role.VENDOR, projectConstants.Role.ADMIN].includes(role)) throw new UnauthorizedException();

    const user = await this.userService.validateUser({ email: username.toLowerCase(), password, role });
    if (!user) throw new BadRequestException('Invalid Credentials');

    delete user.user.password;
    return user;
  };
}
