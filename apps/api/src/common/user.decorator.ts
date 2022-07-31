import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator((value: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return value ? request.user[value] : request.user;
});
