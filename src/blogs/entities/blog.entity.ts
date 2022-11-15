import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type BlogDocument = HydratedDocument<Blog>;
@Schema({ versionKey: false })
export class Blog {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  youtubeUrl: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
