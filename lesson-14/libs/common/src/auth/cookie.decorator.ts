import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request, Response } from 'express';

import { cookieFactory } from '@app/common';

export const Cookie = createParamDecorator(
  (name: string, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const response: Response = ctx.switchToHttp().getResponse();

    const cookies = cookieFactory(request, response);
    const cookie = cookies.get(name);

    return cookie ? cookie : undefined;
  },
);
