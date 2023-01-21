import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { LoginDto } from './dto/login-dto';
import { HashManager } from '../managers/hashManager';

@Injectable()
export class AuthService {
  constructor(
    protected usersRepository: UsersRepository,
    protected hashManager: HashManager,
  ) {}
  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findByLoginOrEmail(
      loginDto.loginOrEmail,
    );
    if (!user) return false;
    return this.hashManager.checkPassword(loginDto.password, user.password);
  }
}
