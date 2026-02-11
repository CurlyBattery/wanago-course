import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  findAllUsers() {}

  updateUser(id: number) {}

  deleteUser(id: number) {}
}
