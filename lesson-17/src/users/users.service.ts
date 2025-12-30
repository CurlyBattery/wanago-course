import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findOneById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      return null;
    }

    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const existsUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existsUser) {
      throw new ConflictException('User already exists');
    }

    const user = this.usersRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
    });

    return this.usersRepository.save(user);
  }

  async setRefreshToken(userId: number, refreshToken: string) {
    const currentRefreshToken =
      refreshToken === null ? null : await this.hashService.hash(refreshToken);

    await this.usersRepository.update(userId, {
      currentRefreshToken,
    });
  }
}
