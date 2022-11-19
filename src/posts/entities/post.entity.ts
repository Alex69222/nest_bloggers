import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Blog } from '../../blogs/entities/blog.entity';

export type PostDocument = HydratedDocument<Post>;
@Schema({ versionKey: false })
export class Post {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  shortDescription: string;
  @Prop({ required: true })
  content: string;
  @Prop({ required: true })
  blogId: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' })
  blogName: Blog;
  @Prop({ required: true })
  createdAt: string;
}
export const PostSchema = SchemaFactory.createForClass(Post);
