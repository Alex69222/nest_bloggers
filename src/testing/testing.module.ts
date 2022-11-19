import { Module } from '@nestjs/common';
import { TestingService } from './testing.service';
import { TestingController } from './testing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from '../posts/entities/post.entity';
import { Blog, BlogSchema } from '../blogs/entities/blog.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Blog.name, schema: BlogSchema },
    ]),
  ],
  controllers: [TestingController],
  providers: [TestingService],
})
export class TestingModule {}
