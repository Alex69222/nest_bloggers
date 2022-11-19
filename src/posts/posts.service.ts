import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';
import { OutputPostDto } from './dto/output-post.dto';
import { PaginationViewType } from '../helpers/transformToPaginationView';
import { QueryType } from '../helpers/queryHandler';

@Injectable()
export class PostsService {
  constructor(private postsRepository: PostsRepository) {}
  async create(createPostDto: CreatePostDto): Promise<OutputPostDto> {
    return this.postsRepository.create(createPostDto);
  }

  async findAll(query: QueryType): Promise<PaginationViewType<OutputPostDto>> {
    return this.postsRepository.findAll(query);
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
