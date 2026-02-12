import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

import { EnvService } from '../../env/env.service';
import { AuthService } from '../auth.service';
import { ACCESS_COOKIE, type AccessPayload } from '../types';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'access-jwt') {
  constructor(
    private readonly envService: EnvService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: (req: Request) => req.cookies[ACCESS_COOKIE],
      secretOrKey: envService.get('ACCESS_SECRET')!,
      ignoreExpiration: false,
    });
  }

  validate(payload: AccessPayload) {
    return this.authService.validateUserByAccess(payload);
  }
}
