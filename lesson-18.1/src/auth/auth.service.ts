import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { AccessPayload, RefreshPayload } from './types';
import { JwtModuleAsyncOptions, JwtService, JwtSignOptions } from '@nestjs/jwt';
import { EnvService } from '../env/env.service';
import { HashService } from '../hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly envService: EnvService,
    private readonly hashService: HashService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.createUser(registerDto);

    const { accessToken, refreshToken } = await this.getTokens(user);
    await this.usersService.setCurrentRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async login(loginDto: LoginDto) {
    const existsUser = await this.usersService.getUserByEmail(loginDto.email);
    if (!existsUser) {
      throw new BadRequestException('Invalid email or password');
    }

    const matchingPasswords = await this.hashService.validate(
      existsUser.hashedPassword,
      loginDto.password,
    );
    if (!matchingPasswords) {
      throw new BadRequestException('Invalid email or password');
    }

    const { accessToken, refreshToken } = await this.getTokens(existsUser);
    await this.usersService.setCurrentRefreshToken(existsUser.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async refresh(user: UserEntity) {
    const { accessToken, refreshToken } = await this.getTokens(user);

    await this.usersService.setCurrentRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(user: UserEntity) {
    await this.usersService.setCurrentRefreshToken(user.id, null);
  }

  async getTokens(user: UserEntity) {
    const accessPayload: AccessPayload = {
      sub: user.id,
      email: user.email,
    };
    const accessToken = await this.jwtService.signAsync(accessPayload);

    const refreshPayload: RefreshPayload = {
      userId: user.id,
    };
    const refreshToken = await this.jwtService.signAsync(refreshPayload, {
      secret: this.envService.get('REFRESH_SECRET'),
      expiresIn: `${this.envService.get('REFRESH_EXP')}d`,
    } as JwtSignOptions);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUserByAccess(payload: AccessPayload) {
    const existsUser = await this.usersService.getUserById(payload.sub);
    if (!existsUser) {
      throw new UnauthorizedException();
    }

    return existsUser;
  }

  async validateUserByRefresh(payload: RefreshPayload) {
    const existsUser = await this.usersService.getUserById(payload.userId);
    if (!existsUser) {
      throw new UnauthorizedException();
    }

    return existsUser;
  }
}
