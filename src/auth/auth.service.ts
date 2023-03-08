import {
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
import { ConfirmationCode } from './entities/confirmationCode.entity';

@Injectable()
export class AuthService {
  constructor(
    protected usersRepository: UsersRepository,
    protected usersService: UsersService,
    protected hashManager: HashManager,
    private jwtService: JwtService,
    protected mailManager: MailManager,
  ) {}
  async login(loginDto: LoginDto): Promise<{ accessToken: string } | false> {
    const user = await this.usersRepository.findByLoginOrEmail(
      loginDto.loginOrEmail,
    );
    if (!user) return false;
    if (!user.emailConfirmation.isConfirmed) return false;
    const passwordMatched = await this.hashManager.checkPassword(
      loginDto.password,
      user.password,
    );
    if (!passwordMatched) return false;
    const payload = { sub: user.id, userName: user.login };
    return {
      accessToken: this.jwtService.sign(payload),
    };
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
      const mailWasSent = await this.mailManager.sendRegistrationEmail(
        createUserDto.email,
        confirmationCode,
      );
    } catch (e) {
      await this.usersRepository.remove(newUser.id);
      throw new HttpException(
        { message: 'Error while sending email. Please try again' },
        HttpStatus.BAD_REQUEST,
      );
    }

    // return mailWasSent;
    return newUser;
  }
  async confirmRegistration(code: string) {
    await this.usersRepository.confirmRegistration(code);
  }
}
