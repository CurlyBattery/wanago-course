import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { PostsService } from './posts.service';
import { PostEntity } from './entities/post.entity';
import { PostsController } from './posts.controller';
import { PostsSearchService } from './posts-search.service';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostEntity]), SearchModule],
  providers: [PostsService, PostsSearchService],
  controllers: [PostsController],
})
export class PostsModule {}
