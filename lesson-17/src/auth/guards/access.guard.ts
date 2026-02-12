import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { isPublic } from '@app/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AccessGuard
  extends AuthGuard('access-jwt')
  implements CanActivate
{
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    ctx: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const _isPublic = isPublic(ctx, this.reflector);
    return _isPublic ? true : super.canActivate(ctx);
  }
}
