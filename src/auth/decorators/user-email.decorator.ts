import { createParamDecorator } from '@nestjs/common';

export const UserEmail = createParamDecorator((data, ctx) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
