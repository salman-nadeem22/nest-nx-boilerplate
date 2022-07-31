import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { projectConstants, serviceEvents } from '@do-business/constants';
import { rpc } from '@do-business/common';
import { AgentDetail } from '../../common/userAgent.decorator';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private fetchData;
  private fetchObject;
  constructor(@Inject(projectConstants.ServicesClient.AUTH) private readonly client: ClientRMQ) {
    this.fetchData = rpc.FetchData(this.client);
    this.fetchObject = rpc.FetchObject(this.client);
  }

  async login(payload: { user: any; ipAddress: string; userAgent: AgentDetail; role: string }) {
    const { user, ipAddress, userAgent, role } = payload;
    return await this.fetchData(serviceEvents.Auth.LOGIN, { user, ipAddress, userAgent, role });
  }

  // ? Tokens
  async IsAccessVerified(data) {
    return await this.fetchObject(serviceEvents.Auth.VERIFY_ACCESS_TOKEN, data);
  }

  async getRefreshPayload(data) {
    return await this.fetchData(serviceEvents.Auth.VERIFY_REFRESH_TOKEN, data);
  }

  async removeRefreshId(user) {
    return lastValueFrom(this.client.send(serviceEvents.Auth.REMOVE_REFRESH_TOKEN, user));
  }

  async refresh(data: { id: string; ipAddress: string; ua: string }) {
    return await this.fetchData(serviceEvents.Auth.REFRESH_TOKEN, data);
  }
}
