import { Injectable } from '@nestjs/common';
import { Comment, CommentDocument } from './comment.entity';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { idMapper } from '../../helpers/id-mapper';
import { OutputCommentDto } from '../dto/output-comment.dto';
import { QueryType } from '../../helpers/queryHandler';
import {
  PaginationViewType,
  transformToPaginationView,
} from '../../helpers/transformToPaginationView';
import { UpdateCommentDto } from '../dto/update-comment.dto';

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
  async findById(id: string): Promise<OutputCommentDto | null> {
    if (!isValidObjectId(id)) return null;
    const comment = await this.commentModel.findById(id).lean();
    if (!comment) return null;
    return idMapper(comment);
  }
  async getPostComments(
    postId: string,
    query: QueryType,
  ): Promise<PaginationViewType<OutputCommentDto>> {
    const totalCount = await this.commentModel.count();
    const comments = await this.commentModel
      .find()
      .sort({ [query.sortBy]: query.sortDirection })
      .skip(query.pageSize * (query.pageNumber - 1))
      .limit(query.pageSize)
      .lean();
    return transformToPaginationView<OutputCommentDto>(
      totalCount,
      query.pageSize,
      query.pageNumber,
      idMapper(comments),
    );
  }
  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<boolean> {
    if (!isValidObjectId(id)) return false;
    const comment = await this.commentModel.findById(id);
    comment.content = updateCommentDto.content;
    await comment.save();
    return true;
  }
  async deleteById(id: string): Promise<boolean> {
    if (!isValidObjectId(id)) return false;
    const deletedComment = await this.commentModel.findByIdAndDelete(id);
    if (!deletedComment) return false;
    return true;
  }
}
