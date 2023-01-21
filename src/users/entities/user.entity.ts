import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;
@Schema({ versionKey: false })
export class User {
  @Prop({ required: true })
  login: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  createdAt: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
