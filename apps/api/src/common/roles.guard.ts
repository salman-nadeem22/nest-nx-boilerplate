import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { projectConstants } from '@do-business/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndMerge<projectConstants.Role[]>('roles', [context.getClass(), context.getHandler()]) || [];

    const isPublic = this.reflector.getAllAndOverride<boolean>('public', [context.getHandler(), context.getClass()]);
    if (!roles || isPublic) {
      return true;
    }

    let isAllowed = false;

    const user: { id: string; role: projectConstants.Role } = context.switchToHttp().getRequest().user;

    roles.forEach((role) => {
      if (user.role === role) {
        isAllowed = true;
      }
    });
    return isAllowed;
  }
}
