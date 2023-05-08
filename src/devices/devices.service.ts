import { Injectable, UnauthorizedException } from '@nestjs/common';
import { DevicesRepository } from './devices.repository';
import { OutputDeviceDto } from './dto/output-device.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from '../config/configuration';

@Injectable()
export class DevicesService {
  constructor(
    protected devicesRepository: DevicesRepository,
    private jwtService: JwtService,
    private configService: ConfigService<ConfigType>,
  ) {
    const tokenSettings = this.configService.get('tokenSettings', {
      infer: true,
    });
    this.refreshSecret = tokenSettings.jwtSecret;
  }
  private refreshSecret: string;
  async createUserSession(
    userId: string,
    deviceId: string,
    expiration: number,
    ip: string,
    userAgent: string,
  ): Promise<boolean> {
    const lastActiveDate = new Date().toISOString();
    const expirationDate = new Date(expiration * 1000).toISOString();
    return this.devicesRepository.createSession(
      userId,
      deviceId,
      lastActiveDate,
      expirationDate,
      ip,
      userAgent,
    );
  }
  async updateUserSession(
    userId: string,
    deviceId: string,
    expiration: number,
  ) {
    const lastActiveDate = new Date().toISOString();
    const expirationDate = new Date(expiration * 1000).toISOString();
    return this.devicesRepository.updateUserSession(
      userId,
      deviceId,
      lastActiveDate,
      expirationDate,
    );
  }
  async deleteAllUserSessionsExceptCurrent(refreshToken: string) {
    const { sub: userId, deviceId } = <RefreshToken>(
      this.jwtService.decode(refreshToken)
    );
    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: this.refreshSecret,
      });
      return this.devicesRepository.deleteAllUserSessionsExceptCurrent(
        userId,
        deviceId,
      );
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }
  async getUserSessions(userId: string): Promise<Array<OutputDeviceDto>> {
    return this.devicesRepository.getUserSessions(userId);
  }

  async deleteUserSession(refreshToken: string, deviceId: string) {
    try {
      await this.jwtService.verifyAsync(refreshToken, {
        secret: this.refreshSecret,
      });
    } catch (e) {
      console.log('this error');
      console.log(e);
      throw new UnauthorizedException();
    }
    const { sub: userId } = <RefreshToken>this.jwtService.decode(refreshToken);
    return this.devicesRepository.deleteUserSession(userId, deviceId);
  }
  async findSessionByDeviceId(deviceId: string) {
    return this.devicesRepository.findSessionByDeviceId(deviceId);
  }
}
