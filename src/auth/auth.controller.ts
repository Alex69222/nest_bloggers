import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ConfirmationCode } from './entities/confirmationCode.entity';
import { Email } from './entities/email.entity';
import { Request, Response } from 'express';
import { cookieSettings } from '../helpers/cookie-settings';
import { Throttle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(
    @Body() loginDto: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    const ip = request.ip;
    const userAgent = request.headers['user-agent'];
    const tokens = await this.authService.login(loginDto, ip, userAgent);
    if (!tokens) throw new UnauthorizedException();
    const [accessToken, refreshToken] = tokens;
    response.cookie('refreshToken', refreshToken.refreshToken, cookieSettings);
    return accessToken;
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/me')
  async me(
    @Req() req,
  ): Promise<{ email: string; login: string; userId: string } | null> {
    return this.authService.me(req.user.userId);
  }
  @Throttle()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/registration')
  async registration(@Body() createUserDto: CreateUserDto) {
    await this.authService.registration(createUserDto);
    return HttpStatus.NO_CONTENT;
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/registration-confirmation')
  async confirmRegistration(@Body() body: ConfirmationCode) {
    await this.authService.confirmRegistration(body.code);
    return HttpStatus.NO_CONTENT;
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/registration-email-resending')
  async resendRegistrationEmail(@Body() body: Email) {
    await this.authService.resendRegistrationConfirmationEmail(body.email);
    return HttpStatus.NO_CONTENT;
  }
  @HttpCode(HttpStatus.OK)
  @Post('/refresh-token')
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string }> {
    const newTokens = await this.authService.handleRefreshToken(
      request.cookies.refreshToken,
    );
    if (!newTokens) throw new UnauthorizedException();
    const [accessToken, refreshToken] = newTokens;
    response.cookie('refreshToken', refreshToken.refreshToken, cookieSettings);
    return accessToken;
  }
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/logout')
  async logout(@Req() request: Request) {
    const successLogout = await this.authService.logout(
      request.cookies.refreshToken,
    );
    if (!successLogout) throw new UnauthorizedException();
    return HttpStatus.NO_CONTENT;
  }
}
