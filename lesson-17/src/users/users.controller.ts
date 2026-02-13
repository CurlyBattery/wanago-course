import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as Multer from 'multer';
import type { Express } from 'express';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import type { RequestWithUser } from '../auth/types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, dto);
  }

  @Delete('avatar')
  async deleteAvatar(@Req() req: RequestWithUser) {
    console.log(req.user.id);
    await this.usersService.deleteAvatar(req.user.id);
    return { message: 'Successfully delete avatar' };
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestWithUser,
  ) {
    const avatarUrl = await this.usersService.uploadAvatar(req.user.id, file);

    return { avatarUrl };
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }

  @Get()
  findAllUsers() {
    return this.usersService.findAllUsers();
  }
}
