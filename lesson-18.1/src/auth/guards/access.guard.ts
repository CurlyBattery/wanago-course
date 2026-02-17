import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { isPublic } from '@app/common';

@Injectable()
export class AccessGuard
  extends AuthGuard('jwt-access')
  implements CanActivate
{
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const _isPublic = isPublic(context, this.reflector);
    if (_isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
