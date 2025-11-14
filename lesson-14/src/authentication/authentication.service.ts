import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dtos/register.dto';
import { AccessTokenPayload } from './types/access-token.payload';
import { addDays, addMinutes, differenceInMilliseconds } from 'date-fns';
import { RefreshTokenPayload } from './types/refresh-token.payload';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    return user;
  }

  async getAuthenticatedUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Wrong credentials');
    }

    const isPasswordMatching = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatching) {
      throw new BadRequestException('Wrong credentials');
    }

    return user;
  }

  async getCookieWithJwtWithAccess(userId: number, email: string) {
    const payload: AccessTokenPayload = { userId, email };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      cookieOptions: {
        httpOnly: true,
        path: '/',
        maxAge: differenceInMilliseconds(
          addMinutes(
            new Date(),
            Number(this.configService.get('JWT_ACCESS_EXPIRATION_TIME')),
          ),
          new Date(),
        ),
      },
    };
  }

  async getCookieWithJwtWithRefresh(userId: number) {
    const payload: RefreshTokenPayload = { userId };
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_EXPIRATION_TIME')}d`,
    });

    await this.usersService.setCurrentRefreshToken(userId, refreshToken);

    return {
      refreshToken,
      cookieOptions: {
        httpOnly: true,
        path: '/',
        maxAge: differenceInMilliseconds(
          addDays(
            new Date(),
            Number(this.configService.get('JWT_REFRESH_EXPIRATION_TIME')),
          ),
          new Date(),
        ),
      },
    };
  }
}
