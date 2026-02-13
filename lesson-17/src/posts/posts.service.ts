import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
  ) {}

  async createPost(createPostDto: CreatePostDto) {
    try {
      const newPost = this.postsRepository.create({
        title: createPostDto.title,
        description: createPostDto.description,
      });
      return this.postsRepository.save(newPost);
    } catch (e: unknown) {
      console.error('Error creating post ', e);
      throw new Error('Error creating post ');
    }
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postsRepository.findOne({
      where: { id },
    });
    if (!post) throw new NotFoundException('Post not found');
    return this.postsRepository.update(id, {
      title: updatePostDto?.title,
      description: updatePostDto?.description,
    });
  }

  async deletePost(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
    });
    if (!post) throw new NotFoundException('Post not found');
    return this.postsRepository.delete(id);
  }

  async findAllPosts() {
    return this.postsRepository.find();
  }
  async findOnePost(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }
}
