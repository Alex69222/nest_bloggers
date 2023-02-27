import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Put,
  UseGuards,
  Request,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { OutputCommentDto } from './dto/output-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // @Post()
  // create(@Body() createCommentDto: CreateCommentDto) {
  //   return this.commentsService.create(createCommentDto);
  // }

  // @Get()
  // findAll() {
  //   return this.commentsService.findAll();
  // }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<OutputCommentDto> {
    const comment = await this.commentsService.findById(id);
    if (!comment) throw new NotFoundException();
    return comment;
  }
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req,
  ) {
    const comment = await this.commentsService.findById(id);
    if (!comment) throw new NotFoundException();
    if (comment.commentatorInfo.userId !== req.user.userId) {
      throw new ForbiddenException();
    }
    await this.commentsService.update(id, updateCommentDto);
    return HttpStatus.NO_CONTENT;
  }
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const comment = await this.commentsService.findById(id);
    if (!comment) throw new NotFoundException();
    if (comment.commentatorInfo.userId !== req.user.userId) {
      throw new ForbiddenException();
    }
    await this.commentsService.remove(id);
    return HttpStatus.NO_CONTENT;
  }
}
