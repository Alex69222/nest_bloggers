import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { DevicesRepository } from './devices.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from './entities/device.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.repository';
import { User, UserSchema } from '../users/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Device.name, schema: DeviceSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [DevicesController],
  providers: [DevicesService, DevicesRepository, JwtService, UsersRepository],
})
export class DevicesModule {}
