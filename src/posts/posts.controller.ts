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
  Query,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { OutputPostDto } from './dto/output-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { PaginationViewType } from '../helpers/transformToPaginationView';
import { queryHandler } from '../helpers/queryHandler';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { OutputCommentDto } from '../comments/dto/output-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @UseGuards(AuthGuard('basic'))
  @Post()
  async create(@Body() createPostDto: CreatePostDto): Promise<OutputPostDto> {
    return this.postsService.create(createPostDto);
  }

  @Get()
  async findAll(@Query() query): Promise<PaginationViewType<OutputPostDto>> {
    return this.postsService.findAll(queryHandler(query));
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
  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  async addComment(
    @Request() req,
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<OutputCommentDto> {
    const post = await this.postsService.findOne(id);
    if (!post) throw new NotFoundException();
    return this.postsService.addComment(id, req.user, createCommentDto);
  }
  @Get(':id/comments')
  async getComments(
    @Param('id') id: string,
    @Query() query,
  ): Promise<PaginationViewType<OutputCommentDto>> {
    const post = await this.postsService.findOne(id);
    if (!post) throw new NotFoundException();
    return this.postsService.getPostComments(id, queryHandler(query));
  }
}
