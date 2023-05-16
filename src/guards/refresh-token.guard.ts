import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.repository';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  private jwtSecret: string;
  constructor(
    private jwtService: JwtService,
    private userRepo: UsersRepository,
    private configService: ConfigService,
  ) {
    this.jwtSecret = configService.get('tokenSettings.jwtSecret');
    console.log(this.jwtSecret);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const token = req.cookies.refreshToken;
      if (!token) throw new UnauthorizedException();
      const payload: any = this.jwtService.verify(token, {
        secret: this.jwtSecret,
      });
      const userId = payload.sub;
      const user = await this.userRepo.findById(userId);
      if (!user) throw new UnauthorizedException();
      req.user = user;
      return true;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
