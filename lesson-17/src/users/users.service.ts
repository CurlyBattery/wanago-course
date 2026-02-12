import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { HashService } from '../hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existsUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existsUser) {
      throw new ConflictException('User already exists');
    }

    try {
      const hashedPassword = await this.hashService.hash(
        createUserDto.password,
      );
      const newUser = this.usersRepository.create({
        username: createUserDto.username,
        email: createUserDto.email,
        hashedPassword,
      });
      return this.usersRepository.save(newUser);
    } catch (e: unknown) {
      console.error('Error creating user ', e);
      throw new BadRequestException('Error creating user');
    }
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const findUser = await this.usersRepository.findOne({
      where: { id },
    });
    if (!findUser) {
      throw new NotFoundException('User not found');
    }

    try {
      return this.usersRepository.update(id, {
        username: updateUserDto.username,
        email: updateUserDto.email,
      });
    } catch (e: unknown) {
      console.error('Error updating user', e);
      throw new BadRequestException('Error updating user');
    }
  }

  async updateRefreshToken(id: number, refreshToken: string | null) {
    const currentRefreshToken =
      refreshToken === null ? null : await this.hashService.hash(refreshToken);

    try {
      await this.usersRepository.update(id, {
        currentRefreshToken: currentRefreshToken! ?? null,
      });
    } catch (e) {
      console.error('Error updating refresh token ', e);
      throw new BadRequestException('Error updating refresh token');
    }
  }

  async deleteUser(id: number) {
    const findUser = await this.usersRepository.findOne({
      where: { id },
    });
    if (!findUser) {
      throw new NotFoundException('User not found');
    }

    try {
      await this.usersRepository.delete(id);
    } catch (e: unknown) {
      console.error('Error deleting user', e);
      throw new BadRequestException('Error deleting user');
    }
  }

  async findOneById(id: number) {
    const findUser = await this.usersRepository.findOne({
      where: { id },
    });
    if (!findUser) {
      return null;
    }

    return findUser;
  }

  async findByEmail(email: string) {
    const findUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (!findUser) {
      return null;
    }

    return findUser;
  }

  findAllUsers() {
    return this.usersRepository.find();
  }
}
