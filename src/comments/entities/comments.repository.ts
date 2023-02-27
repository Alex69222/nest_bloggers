import { Injectable } from '@nestjs/common';
import { Comment, CommentDocument } from './comment.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { idMapper } from '../../helpers/id-mapper';
import { OutputCommentDto } from '../dto/output-comment.dto';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}
  async create(
    postId: string,
    user: {
      userId: string;
      userName: string;
    },
    createCommentDto: CreateCommentDto,
  ): Promise<OutputCommentDto> {
    const createdComment = new this.commentModel({
      ...createCommentDto,
      createdAt: new Date().toISOString(),
      commentatorInfo: {
        userId: user.userId,
        userLogin: user.userName,
      },
    });
    await createdComment.save();
    return idMapper(createdComment.toObject());
  }
}
