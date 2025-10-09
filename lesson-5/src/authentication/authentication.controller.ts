import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dtos/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestWithUser } from './types/request-with-user.interface';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ExcludeNullInterceptor } from '../../utils/exclude-null.interceptor';
import { UserEntity } from '../users/entities/user.entity';

@Controller('authentication')
@SerializeOptions({
  strategy: 'exposeAll',
})
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authenticationService.register(registerDto);
  }

  @Post('log-in')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async logIn(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user } = req;
    const { accessToken, cookieOptions } =
      await this.authenticationService.getCookieWithJwt(user.id);

    res.cookie('access_token', accessToken, cookieOptions);

    return { accessToken };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Post('log-out')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    const { accessToken, cookieOptions } =
      await this.authenticationService.getCookieForLogOut();

    res.cookie('access_token', accessToken, cookieOptions);
  }
}
