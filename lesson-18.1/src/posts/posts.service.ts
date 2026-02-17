import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
  ) {}

  async createPost(createPostDto: CreatePostDto) {
    const newPost = this.postsRepository.create({
      title: createPostDto.title,
      description: createPostDto.description,
    });

    return this.postsRepository.save(newPost);
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto) {
    const existsPost = await this.postsRepository.findOne({
      where: { id },
    });
    if (!existsPost) {
      throw new NotFoundException('Post not found');
    }

    return this.postsRepository.update(id, {
      title: updatePostDto.title,
      description: updatePostDto.description,
    });
  }

  async deletePost(id: number) {
    const existsPost = await this.postsRepository.findOne({
      where: { id },
    });
    if (!existsPost) {
      throw new NotFoundException('Post not found');
    }

    return this.postsRepository.delete(id);
  }

  getAllPosts() {
    return this.postsRepository.find();
  }

  async getOnePost(id: number) {
    const existsPost = await this.postsRepository.findOne({
      where: { id },
    });
    if (!existsPost) {
      throw new NotFoundException('Post not found');
    }

    return existsPost;
  }
}
