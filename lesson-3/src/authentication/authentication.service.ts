import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthenticationService {
  constructor(private readonly usersService: UsersService) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });
    return user;
  }

  async getAuthenticatedUser(email: string, password: string) {
    const user = await this.usersService.getByEmail(email);
    if (!user) {
      throw new BadRequestException('Wrong credentials');
    }

    const isPasswordMathcing = bcrypt.compareSync(password, user.password);
    if (!isPasswordMathcing) {
      throw new BadRequestException('Wrong credentials');
    }

    return user;
  }
}
