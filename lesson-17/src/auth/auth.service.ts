import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dtos/register.dto';
import { UserEntity } from '../users/entities/user.entity';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { AccessPayload, RefreshPayload } from './types';
import { EnvService } from '../env/env.service';
import { LoginDto } from './dtos/login.dto';
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
    const user = await this.usersService.create(registerDto);

    const { accessToken, refreshToken } = await this.getTokens(user);

    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto) {
    const findUser = await this.usersService.findByEmail(loginDto.email);
    if (!findUser) throw new UnauthorizedException('Invalid credentials');

    const matchingPasswords = await this.hashService.verify(
      loginDto.password,
      findUser.hashedPassword,
    );
    if (!matchingPasswords)
      throw new UnauthorizedException('Invalid credentials');

    const { accessToken, refreshToken } = await this.getTokens(findUser);

    await this.usersService.updateRefreshToken(findUser.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(user: UserEntity) {
    await this.usersService.updateRefreshToken(user.id, null);
  }

  async refresh(user: UserEntity) {
    const { accessToken, refreshToken } = await this.getTokens(user);

    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUserByAccess(payload: AccessPayload) {
    const user = await this.usersService.findOneById(payload.sub);

    if (!user) throw new UnauthorizedException();

    return user;
  }

  async validateUserByRefresh(payload: RefreshPayload, refreshToken: string) {
    const user = await this.usersService.findOneById(payload.userId);

    if (!user || !user.currentRefreshToken)
      throw new UnauthorizedException('Invalid refresh token');

    const matchingTokens = await this.hashService.verify(
      refreshToken,
      user.currentRefreshToken,
    );
    if (!matchingTokens)
      throw new UnauthorizedException('Invalid refresh token');

    return user;
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
}
