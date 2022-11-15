import { Inject, Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogsRepository, IBlogsRepository } from './blogs.repository';
import { OutputBlogDto } from './dto/output-blog.dto';

@Injectable()
export class BlogsService {
  constructor(
    @Inject('IBlogsRepository') protected blogsRepository: IBlogsRepository,
  ) {}
  async create(createBlogDto: CreateBlogDto): Promise<OutputBlogDto> {
    return this.blogsRepository.create(createBlogDto);
  }

  async findAll(): Promise<OutputBlogDto[]> {
    return this.blogsRepository.findAll();
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
