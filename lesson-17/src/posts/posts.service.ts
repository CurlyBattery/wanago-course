import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Post } from './entities/post.entity';
import { UpdatePostDto } from './dtos/update-post.dto';
import { CreatePostDto } from './dtos/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postsRepository: Repository<Post>,
  ) {}

  findAll() {
    return this.postsRepository.find();
  }

  async findOne(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  create(createPostDto: CreatePostDto) {
    const post = this.postsRepository.create(createPostDto);
    return this.postsRepository.save(post);
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postsRepository.findOne({
      where: { id },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.postsRepository.update(id, {
      title: updatePostDto.title,
      description: updatePostDto.description,
    });
  }

  async delete(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.postsRepository.delete(id);
  }
}
