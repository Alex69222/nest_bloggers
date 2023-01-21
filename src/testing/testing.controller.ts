import {
  Controller,
  Delete,
  BadRequestException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { TestingService } from './testing.service';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../blogs/entities/blog.entity';
import { Post, PostDocument } from '../posts/entities/post.entity';
import { User, UserDocument } from '../users/entities/user.entity';

const url = process.env.MONGOOSE_URI;

@Controller('testing')
export class TestingController {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/all-data')
  async clearDB() {
    await this.blogModel.deleteMany({});
    await this.postModel.deleteMany({});
    await this.userModel.deleteMany({});
    return;
  }
}
