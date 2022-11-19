import { Inject, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogsRepository, IBlogsRepository } from './blogs.repository';
import { OutputBlogDto } from './dto/output-blog.dto';
import { QueryType } from '../helpers/queryHandler';
import { PaginationViewType } from '../helpers/transformToPaginationView';
import { CreatePostDto } from '../posts/dto/create-post.dto';
import { PostsRepository } from '../posts/posts.repository';
import { OutputPostDto } from '../posts/dto/output-post.dto';

@Injectable()
export class BlogsService {
  constructor(
    @Inject('IBlogsRepository') protected blogsRepository: IBlogsRepository,
    protected postsRepository: PostsRepository,
  ) {}
  async create(createBlogDto: CreateBlogDto): Promise<OutputBlogDto> {
    return this.blogsRepository.create(createBlogDto);
  }
  async createPostForBlog(
    createPostDto: CreatePostDto,
  ): Promise<OutputPostDto> {
    return this.postsRepository.create(createPostDto);
  }

  async findAll(query: QueryType): Promise<PaginationViewType<OutputBlogDto>> {
    return this.blogsRepository.findAll(query);
  }
  async findAllPostsForBlog(
    query: QueryType,
    id: string,
  ): Promise<PaginationViewType<OutputPostDto>> {
    return this.postsRepository.findAllPostsForBlog(query, id);
  }

  async findOne(id: string): Promise<OutputBlogDto | null> {
    return this.blogsRepository.findOne(id);
  }

  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<boolean> {
    return this.blogsRepository.update(id, updateBlogDto);
  }

  async remove(id: string): Promise<boolean> {
    return this.blogsRepository.remove(id);
  }
}
