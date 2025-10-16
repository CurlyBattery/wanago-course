import { Injectable, NotFoundException } from '@nestjs/common';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepo: Repository<PostEntity>,
  ) {}

  async create(dto: CreatePostDto, user: UserEntity) {
    const newPost = this.postsRepo.create({
      ...dto,
      author: user,
    });
    await this.postsRepo.save(newPost);
    return newPost;
  }

  async findAll() {
    return this.postsRepo.find();
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
    const post = await this.postsRepo.findOne({
      where: { id },
    });
    if (post) {
      const updatedPost = await this.postsRepo.update(id, dto);
      return updatedPost;
    }
    throw new NotFoundException('Post not found');
  }

  async remove(id: number) {
    const post = await this.postsRepo.findOne({
      where: { id },
    });
    if (post) {
      return this.postsRepo.delete(id);
    }
    throw new NotFoundException('Post not found');
  }
}
