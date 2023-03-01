import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CommentDocument = HydratedDocument<Comment>;
class CommentatorInfo {
  userId: string;
  userLogin: string;
}
@Schema({ versionKey: false })
export class Comment {
  @Prop({ required: true })
  content: string;
  @Prop({ required: true })
  commentatorInfo: CommentatorInfo;
  @Prop({ required: true })
  createdAt: string;
  @Prop({ required: true })
  postId: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
