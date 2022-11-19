import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { BlogsRepository } from './blogs.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './entities/blog.entity';
import { PostsRepository } from '../posts/posts.repository';
import { Post, PostSchema } from '../posts/entities/post.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    { provide: 'IBlogsRepository', useClass: BlogsRepository },
    PostsRepository,
  ],
})
export class BlogsModule {}
