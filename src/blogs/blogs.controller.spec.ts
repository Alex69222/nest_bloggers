import { Test, TestingModule } from '@nestjs/testing';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from './entities/blog.entity';
import { Post, PostSchema } from '../posts/entities/post.entity';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../test/mongo-memory-server';
import { BlogsRepository } from './blogs.repository';
import { PostsRepository } from '../posts/posts.repository';

describe('BlogsController', () => {
  let controller: BlogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([
          { name: Blog.name, schema: BlogSchema },
          { name: Post.name, schema: PostSchema },
        ]),
        rootMongooseTestModule(),
      ],
      controllers: [BlogsController],
      providers: [
        BlogsService,
        { provide: 'IBlogsRepository', useClass: BlogsRepository },
        PostsRepository,
      ],
    }).compile();

    controller = module.get<BlogsController>(BlogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should create blog', async () => {
    const result = await controller.create({
      name: 'blog99',
      websiteUrl: 'https://youtube.com',
      description: 'description1',
    });
    expect(result.name).toBe('blog99');
  });
  afterAll(async () => {
    await closeInMongodConnection();
  });
});
