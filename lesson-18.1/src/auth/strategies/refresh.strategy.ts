import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

import { AuthService } from '../auth.service';
import { REFRESH_COOKIE, RefreshPayload } from '../types';
import { EnvService } from '../../env/env.service';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly authService: AuthService,
    private readonly envService: EnvService,
  ) {
    super({
      jwtFromRequest: (req: Request) => req.cookies[REFRESH_COOKIE],
      ignoreExpiration: true,
      secretOrKey: envService.get('REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(payload: RefreshPayload) {
    return this.authService.validateUserByRefresh(payload);
  }
}
