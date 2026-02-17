import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class AccessGuard
  extends AuthGuard('jwt-access')
  implements CanActivate
{
  constructor() {
    super();
  }
}
