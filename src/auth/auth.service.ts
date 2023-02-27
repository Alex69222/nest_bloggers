import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { LoginDto } from './dto/login-dto';
import { HashManager } from '../managers/hashManager';
import { JwtService } from '@nestjs/jwt';
import { OutputUserDto } from '../users/dto/output-user.dto';

@Injectable()
export class AuthService {
  constructor(
    protected usersRepository: UsersRepository,
    protected hashManager: HashManager,
    private jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto): Promise<{ accessToken: string } | false> {
    const user = await this.usersRepository.findByLoginOrEmail(
      loginDto.loginOrEmail,
    );
    if (!user) return false;
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
}
