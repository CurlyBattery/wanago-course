import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
  ) {}

  async create({ email, name, password }: CreateUserDto) {
    const existsUser = await this.usersRepo.findOne({
      where: { email },
    });
    if (existsUser) {
      throw new ConflictException('User already exists');
    }

    const user = this.usersRepo.create({
      email,
      name,
      password,
    });
    await this.usersRepo.save(user);
    return user;
  }

  async getByEmail(email: string) {
    const user = await this.usersRepo.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getById(id: number) {
    const user = await this.usersRepo.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
