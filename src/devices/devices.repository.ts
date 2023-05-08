import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OutputDeviceDto } from './dto/output-device.dto';
import { Device, DeviceDocument } from './entities/device.entity';
import { Model } from 'mongoose';

@Injectable()
export class DevicesRepository {
  constructor(
    @InjectModel(Device.name) private deviceModel: Model<DeviceDocument>,
  ) {}
  async createSession(
    userId: string,
    deviceId: string,
    expirationDate: string,
    lastActiveDate: string,
    ip: string,
    userAgent: string,
  ): Promise<boolean> {
    const sessionCreated = new this.deviceModel({
      userId,
      deviceId,
      expirationDate,
      lastActiveDate,
      ip,
      title: userAgent,
    });
    try {
      await sessionCreated.save();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  async updateUserSession(
    userId: string,
    deviceId: string,
    lastActiveDate: string,
    expirationDate: string,
  ) {
    const session = await this.deviceModel.findOne({ deviceId });
    // console.log(deviceId);
    // console.log(session);
    if (!session) throw new NotFoundException();
    if (session.userId !== userId) throw new UnauthorizedException();
    session.expirationDate = expirationDate;
    session.lastActiveDate = lastActiveDate;
    await session.save();
  }
  async deleteUserSession(userId: string, deviceId: string) {
    const session = await this.deviceModel.findOne({ deviceId });
    if (!session) throw new NotFoundException();
    if (session.userId !== userId) throw new UnauthorizedException();
    await this.deviceModel.findByIdAndDelete(session._id);
  }
  async deleteAllUserSessionsExceptCurrent(userId: string, deviceId: string) {
    await this.deviceModel.deleteMany({ userId, deviceId: { $ne: deviceId } });
  }
  async getUserSessions(userId: string): Promise<Array<OutputDeviceDto>> {
    const userSessions = await this.deviceModel.find(
      { userId },
      {
        _id: 0,
        userId: 0,
        expirationDate: 0,
      },
    );
    return userSessions;
  }
  async findSessionByDeviceId(deviceId: string) {
    return this.deviceModel.findOne({ deviceId });
  }
}
