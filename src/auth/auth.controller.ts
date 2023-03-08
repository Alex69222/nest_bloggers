import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ConfirmationCode } from './entities/confirmationCode.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ accessToken: string } | false> {
    const accessToken = await this.authService.login(loginDto);
    if (!accessToken) throw new UnauthorizedException();
    return accessToken;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/me')
  async me(
    @Request() req,
  ): Promise<{ email: string; login: string; userId: string } | null> {
    return this.authService.me(req.user.userId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/registration')
  async registration(@Body() createUserDto: CreateUserDto) {
    await this.authService.registration(createUserDto);
    return HttpStatus.NO_CONTENT;
  }
  // @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/registration-confirmation')
  async confirmRegistration(@Body() body: ConfirmationCode) {
    // await this.authService.confirmRegistration(body.code);
    // return body.code;
    await this.authService.confirmRegistration(body.code);
  }
}
