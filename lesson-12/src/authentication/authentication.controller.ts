import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dtos/register.dto';
import { RequestWithUser } from './types/request-with-user.interface';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authenticationService.register(registerDto);
  }

  // local
  @Post('log-in')
  @HttpCode(HttpStatus.OK)
  async login(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user } = req;
    const { accessToken, cookieOptions } =
      await this.authenticationService.getCookieWithJwt(user.id);

    res.cookie('access_token', accessToken, cookieOptions);

    return { accessToken };
  }

  // auth
  @Get('me')
  me(@Req() req: RequestWithUser) {
    return req.user;
  }

  // auth
  @Post('log-out')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    const { accessToken, cookieOptions } =
      await this.authenticationService.getCookieForLogOut();

    res.cookie('access_token', accessToken, cookieOptions);
  }
}
