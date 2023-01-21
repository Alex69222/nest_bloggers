import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    const loggedInUser = await this.authService.login(loginDto);
    if (!loggedInUser) throw new UnauthorizedException();
    return HttpStatus.NO_CONTENT;
  }
}
