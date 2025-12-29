import { Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  register() {}

  @Post('log-in')
  @HttpCode(HttpStatus.OK)
  login() {}

  @Get()
  me() {}

  @Post('refresh')
  refresh() {}

  @Post('log-out')
  logout() {}
}
