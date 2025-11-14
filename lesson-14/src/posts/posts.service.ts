import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async create(dto: CreatePostDto, author: User) {
    const post = this.postRepository.create({
      title: dto.title,
      content: dto.content,
      author,
    });
    return this.postRepository.save(post);
  }

  getAll() {
    return this.postRepository.find();
  }

  getOne(id: number) {
    const post = this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    return post;
  }

  update(id: number, dto: UpdatePostDto) {
    const post = this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    return this.postRepository.update(id, {
      title: dto.title,
      content: dto.content,
    });
  }

  async delete(id: number) {
    const post = this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    await this.postRepository.delete(id);
  }
}
