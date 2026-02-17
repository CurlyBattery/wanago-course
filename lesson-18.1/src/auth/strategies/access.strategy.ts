import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

import { AuthService } from '../auth.service';
import { ACCESS_COOKIE, AccessPayload } from '../types';
import { EnvService } from '../../env/env.service';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(
    private readonly authService: AuthService,
    private readonly envService: EnvService,
  ) {
    super({
      jwtFromRequest: (req: Request) => req.cookies[ACCESS_COOKIE],
      ignoreExpiration: false,
      secretOrKey: envService.get('ACCESS_SECRET'),
    });
  }

  validate(payload: AccessPayload) {
    return this.authService.validateUserByAccess(payload);
  }
}
