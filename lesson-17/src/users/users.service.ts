import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { HashService } from '../hash/hash.service';
import { MinioService } from 'nestjs-minio-s3';
import type { Express } from 'express';

@Injectable()
export class UsersService {
  private readonly AVATARS_BUCKET = 'avatars';
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly hashService: HashService,
    private readonly minioService: MinioService,
    private readonly dataSource: DataSource,
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

  async uploadAvatar(userId: number, file: Express.Multer.File) {
    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(UserEntity, {
        where: { id: userId },
        select: ['id', 'avatarUrl'],
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const oldAvatarUrl = user.avatarUrl as string;

      const key = `${userId}-${Date.now()}.${file.originalname.split('.').pop()}`;

      const newAvatarUrl = await this.minioService.upload(
        this.AVATARS_BUCKET,
        key,
        file.buffer,
        file.mimetype,
      );

      await manager.update(UserEntity, userId, { avatarUrl: newAvatarUrl });

      if (oldAvatarUrl) {
        try {
          const oldKey = this.minioService.getKeyFromUrl(
            oldAvatarUrl,
            this.AVATARS_BUCKET,
          );
          if (oldKey) {
            await this.minioService.delete(this.AVATARS_BUCKET, oldKey);
          }
        } catch (e: unknown) {
          console.error('Error deleting old avatar ', e);
        }
      }

      return newAvatarUrl;
    });
  }

  async deleteAvatar(userId: number) {
    return await this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(UserEntity, {
        where: { id: userId },
        select: ['id', 'avatarUrl'],
      });
      if (!user || !user?.avatarUrl) {
        throw new NotFoundException('User or avatar not found');
      }

      await manager.update(UserEntity, userId, { avatarUrl: null });

      try {
        const key = this.minioService.getKeyFromUrl(
          user.avatarUrl,
          this.AVATARS_BUCKET,
        );
        if (key) {
          await this.minioService.delete(this.AVATARS_BUCKET, key);
        }
      } catch (e: unknown) {
        console.error('Error deleting avatar from s3', e);
      }
    });
  }
}
