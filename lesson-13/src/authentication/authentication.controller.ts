import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dtos/register.dto';
import { RequestWithUser } from './types/request-with-user.interface';
import { LocalAuthGuard } from './guards/local.guard';
import { cookieFactory, Public } from '@app/common';
import { UsersService } from '../users/users.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authenticationService.register(registerDto);
  }

  @Public()
  @Post('log-in')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user } = req;
    const { accessToken, cookieOptions } =
      await this.authenticationService.getCookieWithJwtWithAccess(
        user.id,
        user.email,
      );

    const refresh =
      await this.authenticationService.getCookieWithJwtWithRefresh(user.id);

    const cookies = cookieFactory(req, res);

    cookies.set('access_token', accessToken, cookieOptions);
    cookies.set('refresh_token', refresh.refreshToken, refresh.cookieOptions);

    return { accessToken };
  }

  @Get('me')
  me(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Post('log-out')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookies = cookieFactory(req, res);
    await this.cookies.remove('access_token');
  }
}
