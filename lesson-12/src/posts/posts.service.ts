import { Injectable, NotFoundException } from '@nestjs/common';
import { PostEntity } from './entities/post.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { UserEntity } from '../users/entities/user.entity';
import { PostsSearchService } from './posts-search.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepo: Repository<PostEntity>,
    private readonly postsSearchService: PostsSearchService,
  ) {}

  async create(dto: CreatePostDto, user: UserEntity) {
    const newPost = this.postsRepo.create({
      ...dto,
      author: user,
    });
    await this.postsRepo.save(newPost);
    await this.postsSearchService.indexPost(newPost);
    return newPost;
  }

  async findAll(text?: string) {
    if (!text) {
      return this.postsRepo.find();
    }
    const results = await this.postsSearchService.search(text);
    const ids = results.map((r) => r.id);
    if (!ids.length) {
      return [];
    }
    return this.postsRepo.find({
      where: { id: In(ids) },
      relations: ['author'],
    });
  }

  async findOne(id: number) {
    const post = await this.postsRepo.findOne({
      where: {
        id,
      },
    });
    if (post) {
      return post;
    }
    throw new NotFoundException('Post not found');
  }

  async update(id: number, dto: UpdatePostDto) {
    await this.postsRepo.update(id, dto);

    const updatedPost = await this.postsRepo.findOne({
      where: { id },
      relations: ['author'],
    });
    if (updatedPost) {
      return await this.postsSearchService.update(updatedPost);
    }
    throw new NotFoundException('Post not found');
  }

  async remove(id: number) {
    const post = await this.postsRepo.findOne({
      where: { id },
    });
    if (post) {
      const post = await this.postsRepo.delete(id);
      await this.postsSearchService.remove(id);
      return post;
    }
    throw new NotFoundException('Post not found');
  }
}
