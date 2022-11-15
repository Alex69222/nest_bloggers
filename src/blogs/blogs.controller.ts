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
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { OutputBlogDto } from './dto/output-blog.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}
  @UseGuards(AuthGuard('basic'))
  @Post()
  async create(@Body() createBlogDto: CreateBlogDto): Promise<OutputBlogDto> {
    return this.blogsService.create(createBlogDto);
  }

  @Get()
  async findAll(): Promise<OutputBlogDto[]> {
    return this.blogsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<OutputBlogDto | null> {
    const blog = await this.blogsService.findOne(id);
    if (!blog) throw new NotFoundException();
    return blog;
  }
  @UseGuards(AuthGuard('basic'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<HttpStatus.NO_CONTENT> {
    const updatedBlog = await this.blogsService.update(id, updateBlogDto);
    if (!updatedBlog) throw new NotFoundException();
    return HttpStatus.NO_CONTENT;
  }
  @UseGuards(AuthGuard('basic'))
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<HttpStatus.NO_CONTENT> {
    const deletedBlog = await this.blogsService.remove(id);
    if (!deletedBlog) throw new NotFoundException();
    return HttpStatus.NO_CONTENT;
  }
}
