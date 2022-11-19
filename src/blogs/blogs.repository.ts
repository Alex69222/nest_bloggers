import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './entities/blog.entity';
import mongoose, { isValidObjectId, Model } from 'mongoose';
import { idMapper } from '../helpers/id-mapper';
import { OutputBlogDto } from './dto/output-blog.dto';

export interface IBlogsRepository {
  create: (createBlogDto: CreateBlogDto) => Promise<OutputBlogDto>;
  findAll: () => Promise<OutputBlogDto[]>;
  findOne: (id: string) => Promise<OutputBlogDto | null>;
  update: (id: string, updateBlogDto: UpdateBlogDto) => Promise<boolean>;
  remove: (id: string) => Promise<boolean>;
}
@Injectable()
export class BlogsRepository implements IBlogsRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async create(createBlogDto: CreateBlogDto): Promise<OutputBlogDto> {
    const createdBlog = new this.blogModel({
      ...createBlogDto,
      createdAt: new Date().toISOString(),
    });
    await createdBlog.save();
    return idMapper(createdBlog.toObject());
  }

  async findAll(): Promise<OutputBlogDto[]> {
    const blogs = await this.blogModel.find().lean();
    return idMapper(blogs);
  }

  async findOne(id: string): Promise<OutputBlogDto | null> {
    if (!isValidObjectId(id)) return null;
    const blog = await this.blogModel.findById(id).lean();
    return idMapper(blog);
  }

  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<boolean> {
    if (!isValidObjectId(id)) return false;
    const blog = await this.blogModel.findById(id);
    if (!blog) return false;
    blog.name = updateBlogDto.name;
    blog.description = updateBlogDto.description;
    blog.websiteUrl = updateBlogDto.websiteUrl;
    await blog.save();
    return true;
  }

  async remove(id: string): Promise<boolean> {
    if (!isValidObjectId(id)) return false;
    const deletedBlog = await this.blogModel.findByIdAndDelete(id);
    if (!deletedBlog) return false;
    return true;
  }
}
