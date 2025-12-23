import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request, Response } from 'express';

import { cookieFactory } from '@app/app';

export const Cookie = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();
    const res: Response = ctx.switchToHttp().getResponse();

    const cookieLib = cookieFactory(req, res);

    return key && key in req.cookies
      ? cookieLib.get(key)
      : key
        ? null
        : req.cookies;
  },
);
