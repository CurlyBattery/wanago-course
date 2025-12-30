import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '../../../../src/authentication/types';

export const CurrentUser = createParamDecorator(
  (_: string, ctx: ExecutionContext) => {
    const req: RequestWithUser = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
