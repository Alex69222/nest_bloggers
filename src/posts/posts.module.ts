import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostsRepository } from './posts.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/post.entity';
import { Blog, BlogSchema } from '../blogs/entities/blog.entity';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { Comment, CommentSchema } from '../comments/entities/comment.entity';
import { CommentsRepository } from '../comments/comments.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, JwtStrategy, CommentsRepository],
})
export class PostsModule {}
