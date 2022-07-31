import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { projectConstants, serviceEvents} from '@do-business/constants';
import { rpc } from '@do-business/common';

@Injectable()
export class UsersService {
  private fetchUserData;

  constructor(@Inject(projectConstants.ServicesClient.USER) private readonly userClient: ClientRMQ) {
    this.fetchUserData = rpc.FetchData(this.userClient);
  }

  async register(data:any) {
    const { ipAddress, userAgent, user } = data;
    return await this.fetchUserData(serviceEvents.Auth.REGISTER, { user, ipAddress, userAgent });
  }

  async updateUser(data:any) {
    return this.fetchUserData(serviceEvents.User.UPDATE_USER, { ...data.body, vendorId: data.user.id });
  }

  async validateUser(data:any):Promise<any> {
    return {}
  }
}
