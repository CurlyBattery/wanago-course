import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { HashService } from '../hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async create(dto: CreateUserDto) {
    const existsUser = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    if (existsUser) {
      throw new ConflictException('User already exists');
    }

    const user = this.usersRepository.create(dto);
    return this.usersRepository.save(user);
  }

  async findById(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      return null;
    }

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });
    if (!user) {
      return null;
    }

    return user;
  }

  async setRefreshToken(userId: number, refreshToken: string) {
    const currentRefreshToken = refreshToken === null ? null : await this.hashService.hash(refreshToken);

    await this.usersRepository.update(userId, {
      currentRefreshToken,
    });
  }

  async updateAvatarUrl(userId: number, avatarUrl: string) {
    await this.usersRepository.update(userId, {
      avatarUrl,
    });
  }

  async getAvatarUrl(userId: number): Promise<string | null> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['avatarUrl'],
    });
    return user?.avatarUrl || null;
  }
}
