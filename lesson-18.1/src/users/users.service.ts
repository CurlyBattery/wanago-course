import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { HashService } from '../hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly hashService: HashService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const existsUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existsUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await this.hashService.hash(createUserDto.password);

    const newUser = this.usersRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      hashedPassword,
    });
    return await this.usersRepository.save(newUser);
  }

  async getUserById(id: number) {
    const existsUser = await this.usersRepository.findOne({
      where: { id },
    });
    if (!existsUser) {
      return null;
    }
    return existsUser;
  }

  async getUserByEmail(email: string) {
    const existsUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (!existsUser) {
      return null;
    }
    return existsUser;
  }

  async setCurrentRefreshToken(userId: number, refreshToken: string | null) {
    const existsUser = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!existsUser) {
      throw new NotFoundException('User does not exist');
    }

    return this.usersRepository.update(userId, {
      currentRefreshToken: refreshToken,
    });
  }
}
