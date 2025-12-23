import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { EnvService } from '../../env/env.service';
import { AuthenticationService } from '../authnetication.service';
import { Request } from 'express';
import { ACCESS_COOKIE, AccessPayload } from '../types';

@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly envService: EnvService,
    private readonly authenticationService: AuthenticationService,
  ) {
    super({
      jwtFromRequest: (req: Request) => req.cookies[ACCESS_COOKIE],
      secretOrKey: envService.get('JWT_ACCESS_SECRET'),
      ignoreExpiration: false,
    });
  }

  validate(payload: AccessPayload) {
    return this.authenticationService.validateUserByAccess(payload);
  }
}
