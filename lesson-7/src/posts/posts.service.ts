import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PostNotFoundException } from './exceptions/post-not-found.exception';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
  ) {}

  async create(createPostDto: CreatePostDto, user: UserEntity) {
    const newPost = this.postsRepository.create({
      ...createPostDto,
      author: user,
    });
    await this.postsRepository.save(newPost);
    return newPost;
  }

  findAll() {
    return this.postsRepository.find({ relations: ['author', 'categories'] });
  }

  async findOne(id: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id,
      },
    });
    if (post) {
      return post;
    }
    throw new PostNotFoundException(id);
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postsRepository.findOne({
      where: {
        id,
      },
    });
    if (post) {
      const updatedPost = await this.postsRepository.update(id, updatePostDto);
      return updatedPost;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async remove(id: number) {
    const post = await this.postsRepository.findOne({
      where: {
        id,
      },
    });
    if (post) {
      return this.postsRepository.delete(id);
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }
}
