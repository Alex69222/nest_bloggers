import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';
import { OutputPostDto } from './dto/output-post.dto';

@Injectable()
export class PostsService {
  constructor(private postsRepository: PostsRepository) {}
  async create(createPostDto: CreatePostDto): Promise<OutputPostDto> {
    return this.postsRepository.create(createPostDto);
  }

  async findAll(): Promise<OutputPostDto[]> {
    return this.postsRepository.findAll();
  }

  async findOne(id: string): Promise<OutputPostDto | null> {
    return this.postsRepository.findOne(id);
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<boolean> {
    return this.postsRepository.update(id, updatePostDto);
  }

  async remove(id: string): Promise<boolean> {
    return this.postsRepository.remove(id);
  }
}
