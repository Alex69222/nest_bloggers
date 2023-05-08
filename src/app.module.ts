import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogsModule } from './blogs/blogs.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { ConfigType } from './config/configuration';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from './exeption.filter';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { BlogExistsValidator } from './validators/blog-exists-validator';
import { BlogsRepository } from './blogs/blogs.repository';
import { Blog, BlogSchema } from './blogs/entities/blog.entity';
import { TestingModule } from './testing/testing.module';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { DevicesModule } from './devices/devices.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerBehindProxyGuard } from './guards/throttler-behind-proxy.guard';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService<ConfigType>) => {
        const databaseSettings = config.get('database', { infer: true });
        return {
          uri: databaseSettings.MONGOOSE_URI,
        };
      },
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          service: config.get<string>('smtp.service'),
          host: config.get<string>('smtp.host'),
          secure: false,
          port: config.get<number>('smtp.port'),
          auth: {
            user: config.get<string>('smtp.user'),
            pass: config.get<string>('smtp.password'),
          },
        },
        defaults: {
          from: `"Bloggers social media" <noreply.notifycations@gmail.com>`,
        },
      }),
    }),
    BlogsModule,
    PostsModule,
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    TestingModule,
    UsersModule,
    CommentsModule,
    DevicesModule,
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 5,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    BlogExistsValidator,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    { provide: 'IBlogsRepository', useClass: BlogsRepository },
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
  ],
})
export class AppModule {}
