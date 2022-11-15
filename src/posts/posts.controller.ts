import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { OutputPostDto } from './dto/output-post.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @UseGuards(AuthGuard('basic'))
  @Post()
  async create(@Body() createPostDto: CreatePostDto): Promise<OutputPostDto> {
    return this.postsService.create(createPostDto);
  }

  @Get()
  async findAll(): Promise<OutputPostDto[]> {
    return this.postsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<OutputPostDto | null> {
    const post = await this.postsService.findOne(id);
    if (!post) throw new NotFoundException();
    return post;
  }
  @UseGuards(AuthGuard('basic'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<HttpStatus.NO_CONTENT> {
    const updatedPost = await this.postsService.update(id, updatePostDto);
    if (!updatedPost) throw new NotFoundException();
    return HttpStatus.NO_CONTENT;
  }
  @UseGuards(AuthGuard('basic'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deletedPost = await this.postsService.remove(id);
    if (!deletedPost) throw new NotFoundException();
    return deletedPost;
  }
}
