import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('security/devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@Req() req) {
    return this.devicesService.getUserSessions(req.user.id);
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteSession(@Param('id') id: string, @Req() req) {
    return this.devicesService.deleteUserSession(req.cookies.refreshToken, id);
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  deleteAllSessionsExceptCurrent(@Req() req) {
    if (!req.cookies.refreshToken) throw new UnauthorizedException();
    return this.devicesService.deleteAllUserSessionsExceptCurrent(
      req.cookies.refreshToken,
    );
  }
}
