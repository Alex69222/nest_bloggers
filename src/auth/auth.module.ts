import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BasicStrategy } from './strategies/auth-basic.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersRepository } from '../users/users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/entities/user.entity';
import { HashManager } from '../managers/hashManager';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailManager } from '../managers/mailManager';
import { UsersService } from '../users/users.service';
import { DevicesService } from '../devices/devices.service';
import { DevicesRepository } from '../devices/devices.repository';
import { Device, DeviceSchema } from '../devices/entities/device.entity';
import { ConfigType } from '../config/configuration';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Device.name, schema: DeviceSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigType>) => {
        const tokenSettings = configService.get('tokenSettings', {
          infer: true,
        });

        return {
          secret: tokenSettings.jwtSecret,
          signOptions: {
            expiresIn: tokenSettings.jwtRefreshExpirationTime,
          },
        };
      },
    }),
  ],
  providers: [
    BasicStrategy,
    AuthService,
    UsersRepository,
    UsersService,
    HashManager,
    JwtStrategy,
    MailManager,
    DevicesService,
    DevicesRepository,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
