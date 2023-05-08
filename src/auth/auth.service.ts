import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { LoginDto } from './dto/login-dto';
import { HashManager } from '../managers/hashManager';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { MailManager } from '../managers/mailManager';
import { UsersService } from '../users/users.service';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { DevicesService } from '../devices/devices.service';

export type RefreshToken = {
  sub: string;
  userName: string;
  deviceId: string;
  iat: number;
  exp: number;
};
@Injectable()
export class AuthService {
  constructor(
    protected usersRepository: UsersRepository,
    protected usersService: UsersService,
    protected hashManager: HashManager,
    private jwtService: JwtService,
    protected mailManager: MailManager,
    protected configService: ConfigService,
    protected deviceService: DevicesService,
  ) {}
  async makeAccessAndRefreshTokens(
    userId: string,
    userLogin: string,
    deviceId: string,
  ): Promise<[{ accessToken: string }, { refreshToken: string }]> {
    const accessPayload = { sub: userId, userName: userLogin };
    const refreshPayload = { sub: userId, userName: userLogin, deviceId };

    const accessToken = this.jwtService.sign(accessPayload);
    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: this.configService.get<string>(
        'tokenSettings.jwtRefreshExpirationTime',
      ),
    });
    return [
      {
        accessToken,
      },
      {
        refreshToken,
      },
    ];
  }
  async login(
    loginDto: LoginDto,
    ip: string,
    userAgent: string,
  ): Promise<[{ accessToken: string }, { refreshToken: string }] | false> {
    const user = await this.usersRepository.findByLoginOrEmail(
      loginDto.loginOrEmail,
    );
    if (!user) return false;
    // if (!user.emailConfirmation.isConfirmed) return false;
    const passwordMatched = await this.hashManager.checkPassword(
      loginDto.password,
      user.password,
    );
    if (!passwordMatched) return false;
    const deviceId = uuidv4();
    const tokens = await this.makeAccessAndRefreshTokens(
      user.id,
      user.login,
      deviceId,
    );
    const { exp } = <RefreshToken>(
      this.jwtService.decode(tokens[1].refreshToken)
    );
    await this.deviceService.createUserSession(
      user.id,
      deviceId,
      exp,
      ip,
      userAgent,
    );
    return tokens;
  }

  async me(
    id: string,
  ): Promise<{ email: string; login: string; userId: string } | null> {
    const user = await this.usersRepository.findById(id);
    const { email, login, id: userId } = user;
    return { email, login, userId };
  }

  async registration(createUserDto: CreateUserDto) {
    const confirmationCode = uuidv4();
    const newUser = await this.usersService.create(
      createUserDto,
      null,
      confirmationCode,
    );
    try {
      await this.mailManager.sendRegistrationEmail(
        createUserDto.email,
        confirmationCode,
      );
    } catch (e) {
      await this.usersRepository.remove(newUser.id);
      throw new HttpException(
        { message: 'Error while sending email. Please try to register again' },
        HttpStatus.BAD_REQUEST,
      );
    }

    return newUser;
  }

  async confirmRegistration(code: string) {
    await this.usersRepository.confirmRegistration(code);
  }

  async resendRegistrationConfirmationEmail(email: string) {
    const user = await this.usersRepository.findByLoginOrEmail(email);
    if (!user) {
      throw new BadRequestException([
        { message: 'Email is not registered', field: 'email' },
      ]);
    }
    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestException([
        { message: 'User is already confirmed', field: 'email' },
      ]);
    }
    const newConfirmationCode = uuidv4();
    await this.usersRepository.changeConfirmationCode(
      email,
      newConfirmationCode,
    );
    await this.mailManager.sendRegistrationEmail(email, newConfirmationCode);
  }

  async handleRefreshToken(
    refreshToken: string,
  ): Promise<[{ accessToken: string }, { refreshToken: string }] | false> {
    if (!refreshToken) return false;
    try {
      console.log('verification');
      const verification = await this.jwtService.verifyAsync(refreshToken);
      console.log(verification);
    } catch (e) {
      console.log(e);
      return false;
    }
    const decodedToken = <RefreshToken>this.jwtService.decode(refreshToken);
    const { deviceId, sub: userId, userName } = decodedToken;
    const session = this.deviceService.findSessionByDeviceId(deviceId);
    if (!session) throw new UnauthorizedException();
    if (!deviceId) return false;
    const tokens = await this.makeAccessAndRefreshTokens(
      userId,
      userName,
      deviceId,
    );
    const { exp } = <RefreshToken>(
      this.jwtService.decode(tokens[1].refreshToken)
    );
    await this.deviceService.updateUserSession(userId, deviceId, exp);
    return tokens;
  }
  async logout(refreshToken: string) {
    if (!refreshToken) return false;
    const decodedToken = <RefreshToken>this.jwtService.decode(refreshToken);
    const { deviceId } = decodedToken;
    // if (!deviceId) return false;
    try {
      await this.jwtService.verifyAsync(refreshToken);
      const sessionRemoved = await this.deviceService.deleteUserSession(
        refreshToken,
        deviceId,
      );
      return sessionRemoved;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
