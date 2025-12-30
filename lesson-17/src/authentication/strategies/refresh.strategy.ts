import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';

import { EnvService } from '../../env/env.service';
import { AuthenticationService } from '../authentication.service';
import { REFRESH_COOKIE, RefreshPayload } from '../types';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private readonly envService: EnvService,
    private readonly authenticationService: AuthenticationService,
  ) {
    super({
      jwtFromRequest: (req: Request) => req.cookies[REFRESH_COOKIE],
      secretOrKey: envService.get('JWT_REFRESH_SECRET'),
      ignoreExpiration: true,
    });
  }

  validate(payload: RefreshPayload) {
    return this.authenticationService.validateUserByRefresh(payload);
  }
}
