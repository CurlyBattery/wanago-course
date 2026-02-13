import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';

import { PostsService } from './posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PaginationPostsParam } from './dtos/pagination-posts.param';
import type { RequestWithUser } from '../auth/types';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  createPost(@Req() req: RequestWithUser, @Body() dto: CreatePostDto) {
    return this.postsService.createPost(req.user.id, dto);
  }

  @Patch(':id')
  updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postsService.updatePost(id, dto);
  }

  @Delete(':id')
  deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }

  @Get()
  findAllPosts(@Query() { offset, limit }: PaginationPostsParam) {
    return this.postsService.findAllPosts(offset, limit);
  }

  @Get(':id')
  findOnePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOnePost(id);
  }
}
