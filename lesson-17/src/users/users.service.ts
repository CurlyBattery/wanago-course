import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersService: Repository<UserEntity>,
  ) {}

  create() {}

  updateUser(id: number) {}

  deleteUser(id: number) {}

  findOneById(id: number) {}

  findByEmail(email: string) {}

  findAllUsers() {}
}
