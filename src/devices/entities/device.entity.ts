import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type DeviceDocument = HydratedDocument<Device>;
@Schema({ versionKey: false })
export class Device {
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true, unique: true })
  deviceId: string;
  @Prop({ required: true })
  lastActiveDate: string;
  @Prop({ required: true })
  expirationDate: string;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  ip: string;
}
export const DeviceSchema = SchemaFactory.createForClass(Device);
