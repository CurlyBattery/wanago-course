import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { HashModule } from '../hash/hash.module';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), HashModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
